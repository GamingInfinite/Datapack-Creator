<script lang="ts">
  import JSZip from "jszip";
  import FileSaver from "file-saver";

  import { EditableObject, MCCommand, MCFunction } from "../lib/IDK";
  import CustomDropdown from "../lib/components/customDropdown.svelte";
  import { MetaData, files } from "../stores";
  import { Selectors } from "$lib/Enums";

  let EditorTarget: EditableObject;
  let data = [{ name: "minecraft" }, { name: $MetaData.name }];

  MetaData.subscribe((value) => {
    data[1].name = value.name;
  });

  $: if (EditorTarget) {
    if (EditorTarget["name"] != data[1].name) {
      MetaData.set($MetaData);
    }
  }

  function savePack() {
    let zip = new JSZip();
    zip.file("pack.mcmeta", JSON.stringify($MetaData.exportAsObject()));
    let root = zip.folder("data");
    for (let folder of data) {
      let datafolder = root.folder(folder.name);
      if (folder.name != "minecraft") {
        let functions = datafolder.folder("functions");
        let MCFunctions = $files;
        for (let file of MCFunctions) {
          let functionfile = file.returnAsFile();
          functions.file(`${file.name}.mcfunction`, functionfile);
        }
      } else {
        let tags = datafolder.folder("tags");
        let tagFunctions = tags.folder("functions");
        let tick = { values: [`${$MetaData.name}:tick`] };
        let load = { values: [`${$MetaData.name}:load`] };
        tagFunctions.file("tick.json", JSON.stringify(tick));
        tagFunctions.file("load.json", JSON.stringify(load));
      }
    }
    zip.generateAsync({ type: "blob" }).then(function (content) {
      FileSaver.saveAs(content, `${$MetaData.name}.zip`);
    });
  }

  function addFiles(file: MCFunction | MCFunction[]) {
    files.update((files) => {
      if (Array.isArray(file)) {
        for (let f of file) {
          files.push(f);
        }
      } else {
        files.push(file);
      }
      return files;
    });
  }
  addFiles(
    new MCFunction("load", [
      new MCCommand("tellraw", [
        Selectors.ALLPLAYERS,
        `Loading ${$MetaData.name}`,
      ]),
    ]),
    new MCFunction("tick")
  );
</script>

<svelte:head>
  <title>Datapack Creator</title>
</svelte:head>

<div class="flex flex-row justify-center gap-4 mt-4">
  <div class="flex flex-col min-w-48">
    <div class="flex flex-row">
      <CustomDropdown item={data}>Data</CustomDropdown>
    </div>
    <div class="flex flex-row">
      <button
        class="btn btn-ghost h-4 p-0 max-w-48 min-h-8 w-full"
        on:click={() => {
          EditorTarget = $MetaData;
        }}
      >
        <div class="m-auto"></div>
        Metadata
        <div class="mr-2"></div>
      </button>
    </div>
  </div>
  <div class="flex flex-col">
    {#if EditorTarget}
      {#each Object.entries(EditorTarget) as [key, value]}
        <div class="flex flex-row">
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">{key}</span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              class="input input-bordered w-full max-w-xs"
              bind:value={EditorTarget[key]}
            />
          </label>
        </div>
      {/each}
    {:else}
      <div class="flex flex-row">
        Please click a file/feature on the left to start editing.
      </div>
    {/if}
  </div>
</div>

<div class="fixed bottom-4 right-4">
  <button class="btn btn-secondary" on:click={savePack}>Save Pack</button>
</div>

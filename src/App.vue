<template>
  <div class="container">
    <section class="section__select">
      <h3>Report Servidesk</h3>

      <button @click="showDialog">Select file</button>
      <p class="select__file">{{ fileSelect }}</p>

      <DateFilter @set-date="selectDate" class="date__filter" />
      <p class="select__file">{{ datesSearch }}</p>
    </section>

    <section class="section__files">
      <loading
        v-model:active="isLoading"
        :can-cancel="true"
        :is-full-page="false"
        :color="'#1565C0'"
      />
      <div class="div__files">
        <h4 v-if="isFilesIss">Instalaciones servicios</h4>
        <CardExcel
          v-for="(file, item) in filesIss"
          :key="item"
          :draggable="true"
          @dragstart="handleDragStart($event, file, item, 'filesIss')"
          @dragend="handleDragEnd($event, item, 'filesIss')"
          :title="file.name"
        />
      </div>

      <div class="div__files">
        <h4 v-if="isFilesIntegria">Integria tecnologia</h4>
        <CardExcel
          v-for="(file, item) in filesIntegria"
          :key="item"
          draggable="true"
          @dragstart="handleDragStart($event, file)"
          @ondragend="handleDragEnd($event, item, 'filesIntegria')"
          :title="file.name"
        />
      </div>
    </section>

    <section class="section__process">
      <button @click="setProcess" :disabled="isDisabled">Process</button>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, reactive, toRaw, onMounted } from "vue";
import DateFilter from "@/components/DateFilter.vue";
import CardExcel from "@/components/CardExcel.vue";
import dayjs from "dayjs";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";

const isLoading = ref(false);
const fileSelect = ref("Choose file name...");
const filesIss = ref([]);
const filesIntegria = ref([]);

const dates = reactive({
  initDate: null,
  endDate: null,
});

const datesSearch = computed(() =>
  dates.initDate !== null
    ? `Dates week: ${dates.endDate.format(
        "DD MMM,YYYY"
      )} -- ${dates.initDate.format("DD MMM,YYYY")}`
    : "Select dates for query..."
);

const isDisabled = computed(() => {
  return (
    fileSelect.value === "Choose file name..." ||
    (dates.initDate === null && dates.endDate === null)
  );
});

const isFilesIss = computed(() => filesIss.value.length > 0);
const isFilesIntegria = computed(() => filesIntegria.value.length > 0);

const showDialog = () => {
  window.electronApi.openDialog();
};

const selectDate = (date) => {
  dates.initDate = dayjs(date);
  dates.endDate = dates.initDate.subtract(6, "day");
};

window.electronApi.onFileSelected((event, filePath) => {
  fileSelect.value = filePath;
});

const handleDragStart = (event, file, item, arrayName) => {
  event.preventDefault();
  try {
    // Convertir el proxy a objeto real
    const rawFile = toRaw(file);

    if (!rawFile?.path) {
      throw new Error("El objeto no tiene path");
    }

    // Verificar existencia del archivo (opcional pero recomendado)
    window.electronApi.checkFileExists(rawFile.path).then((exists) => {
      if (!exists) throw new Error("Archivo no existe");
      // window.electronApi.startDrag(rawFile.path);
      window.electronApi.startDrag(rawFile.path, arrayName, item);
    });
  } catch (error) {
    console.error("Error en drag:", error);
  }
};

const handleDragEnd = (event, item, arrayName) => {
  //  event.preventDefault();
  window.electronApi.dragend(item, arrayName);
  // if (arrayName === "filesIss") {
  //   filesIss.value.splice(item, 1);
  //   console.log("array after", filesIss.value);
  // } else if (arrayName === "filesIntegria") {
  //   filesIntegria.value.splice(item, 1);
  // }
};

// const handleDrop = (event, item) => {
//   console.log("handledrop", event);
//   console.log("drop", item);
// };

// const handleOver = (event) => {
//   console.log("handleover", event);
// };

const setProcess = async () => {
  isLoading.value = true;
  const formattedDates = {
    initDate: dates.initDate.format("DD/MM/YYYY"),
    endDate: dates.endDate.format("DD/MM/YYYY"),
  };
  try {
    const { filesIss: iss, filesIntegria: integria } =
      await window.electronApi.initProcess(formattedDates);
    filesIss.value = iss;
    filesIntegria.value = integria;
    isLoading.value = false;
  } catch (error) {
    console.error("Error al crear los archivos:", error);
  }
};

// onMounted(() => {
//   window.electronApi.onFileDroppedOutside(({ arrayName, index }) => {
//     console.log("Archivo soltado fuera de la ventana", arrayName, index);

//     if (arrayName === "filesIss") {
//       filesIss.value.splice(index, 1);
//     } else if (arrayName === "filesIntegria") {
//       filesIntegria.value.splice(index, 1);
//     }
//   });

//   // Si el usuario regresa a la ventana, cancelamos la eliminación
//   window.electronApi.onCancelDrag(() => {
//     console.log(
//       "El usuario regresó sin soltar el archivo. No eliminamos nada."
//     );
//   });
// });
</script>

<style scoped>
.container {
  min-height: 40rem;
  border: 1px solid var(--color);
  border-radius: 10px;
  padding: 15px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.section__select {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: 1fr auto 1fr;
}
.section__select h3 {
  grid-column: 1 / -1;
  grid-row: 1 / 2;
}

.section__select button,
.date__filter {
  justify-self: center;
  align-self: center;
}

.select__file {
  justify-self: start;
  align-self: center;
  margin-left: 1.5rem;
}

.section__files {
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.div__files {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
  grid-template-rows: 2rem auto;
  gap: 1.5rem;
  padding: 1rem;
}

.div__files h4 {
  grid-column: 1 / -1;
  border-bottom: 1px solid #fff;
  padding-bottom: 0.3rem;
  width: 12rem;
  align-self: center;
  justify-self: center;
}

.section__process {
  display: flex;
  justify-content: center;
  padding: 1rem;
}

button {
  font-size: 15px;
  color: var(--color);
  border-radius: 8px;

  border: 1px solid transparent;
  padding: 8px 20px;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #444;
}
button:disabled:hover {
  border-color: transparent; /* Evita que cambie el borde al pasar el mouse */
}

.select__file {
  max-width: 35rem; /* Establecer un ancho máximo */
  word-wrap: break-word; /* Habilitar el ajuste de texto */
  overflow-wrap: break-word; /* Habilitar el ajuste de texto */
}
</style>

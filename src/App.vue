<template>
  <div class="container">
    <section class="section__select">
      <h3>Report Servidesk</h3>

      <button @click="showDialog">Select file</button>
      <p class="select__file">{{ fileSelect }}</p>
      <DateFilter @set-date="selectDate" class="date__filter" />
      <p class="select__file">{{ datesSearch }}</p>
    </section>

    <section class="section__process">
      <button @click="setProcess" :disabled="isDisabled">Process</button>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, reactive, toRaw } from "vue";
import DateFilter from "./components/DateFilter.vue";
import dayjs from "dayjs";

const fileSelect = ref("Choose file name...");

const dates = reactive({
  initDate: null,
  endDate: null,
});

const datesSearch = computed(() =>
  dates.initDate !== null
    ? `Dates week: ${dates.initDate.format(
        "DD MMM,YYYY"
      )} -- ${dates.endDate.format("DD MMM,YYYY")}`
    : "Select dates for query..."
);

const isDisabled = computed(
  () =>
    fileSelect.value === "Choose file name..." ||
    datesSearch.value === "Select dates for query..."
);

const showDialog = () => {
  // window.electronApi.btn(fileSelect.value);
  window.electronApi.openDialog();
};

const selectDate = (date) => {
  dates.initDate = dayjs(date);
  dates.endDate = dates.initDate.subtract(6, "day");
};

window.electronApi.onFileSelected((event, filePath) => {
  fileSelect.value = filePath;
});


const setProcess = () => {
  const formattedDates = {
    initDate: dates.initDate.format('DD/MM/YYYY'),
    endDate: dates.endDate.format('DD/MM/YYYY')
  };
  window.electronApi.initProcess(formattedDates);
}

</script>

<style scoped>
.container {
  border: 1px solid var(--color);
  border-radius: 10px;
  padding: 15px 20px;
  min-width: 40rem;
  min-height: 35rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.section__select {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: 1fr auto;
  gap: 10px;
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

.select__file {
  max-width: 35rem; /* Establecer un ancho máximo */
  word-wrap: break-word; /* Habilitar el ajuste de texto */
  overflow-wrap: break-word; /* Habilitar el ajuste de texto */
}
</style>

<template>
  <DatePicker
    :use-utc="true"
    :maximum-view="'day'"
    placeholder="Select Day"
    :minimum-view="'day'"
    @input="selectDate"
    :full-month-name="true"
    :input-class="['customInputClass']"
    :calendar-class="['customCalendarClass']"
    :wrapper-class="['wrapperClass']"
    :monday-first="true"
  />
</template>

<script setup>
import DatePicker from "vuejs3-datepicker";

const emit = defineEmits(["setDate"]);

const selectDate = (date) => {
  emit("setDate", date);
};
</script>

<style lang="css" scoped>
:deep(.vuejs3-datepicker__calendar) {
  touch-action: none;
}

:deep(.vuejs3-datepicker__calendar-topbar) {
  display: none;
}

:deep(.customCalendarClass) {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.5);
  border-radius: 20px;
}

:deep(.vuejs3-datepicker__calendar-actionarea .prev:not(.disabled):hover),
:deep(.vuejs3-datepicker__calendar-actionarea .next:not(.disabled):hover) {
  border-radius: 100%;
  background-color: rgb(239, 246, 255);
}

:deep(.vuejs3-datepicker__calendar-actionarea .cell.day.disabled) {
  color: #9ca3af;
}

:deep(.vuejs3-datepicker__calendar-actionarea .cell.day.selected),
:deep(.vuejs3-datepicker__calendar-actionarea .cell.day.highlighted) {
  background-color: rgb(239, 246, 255);
  border-radius: 100%;
}

:deep(.vuejs3-datepicker__calendar-actionarea .cell.day) {
  color: #1a1a1a;
  border: none;
  border-radius: 100%;
}

:deep(.vuejs3-datepicker__calendar-actionarea .cell.day:hover) {
  border: none !important;
  background-color: rgb(239, 246, 255);
  border-radius: 100%;
}

:deep(#calendar-div) {
  border: 1px solid var(--color-text);
  border-radius: 10px;
  height: 35px;
  width: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.vuejs3-datepicker__value) {
  border: none;
  display: flex;
  justify-content: center;
}

:deep(.vuejs3-datepicker__icon),
:deep(.vuejs3-datepicker__content) {
  color: var(--color-text);
}
</style>

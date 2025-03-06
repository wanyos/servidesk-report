<template>
  <DatePicker
    :use-utc="true"
    :maximum-view="'day'"
    placeholder="Select day"
    :minimum-view="'day'"
    @input="selectDate"
    :full-month-name="true"
    :calendar-class="['customCalendarClass']"
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
  background-color: var(--background);
  color: var(--color);
}

:deep(.vuejs3-datepicker__calendar-actionarea .prev:not(.disabled)),
:deep(.vuejs3-datepicker__calendar-actionarea .next:not(.disabled)) {
  border-radius: 100%;
  background-color: rgb(130, 133, 137);
  color: var(--text);
}

:deep(.vuejs3-datepicker__calendar-actionarea .prev:not(.disabled):hover),
:deep(.vuejs3-datepicker__calendar-actionarea .next:not(.disabled):hover) {
  border-radius: 100%;
  background-color: rgb(68, 71, 75);
}

:deep(.vuejs3-datepicker__calendar-actionarea .cell.day.disabled) {
  color: #9ca3af;
}

:deep(.vuejs3-datepicker__calendar-actionarea .cell.day.selected),
:deep(.vuejs3-datepicker__calendar-actionarea .cell.day.highlighted) {
  background-color: rgb(68, 71, 75);
  border-radius: 100%;
}

:deep(.vuejs3-datepicker__calendar-actionarea .cell.day) {
  color: var(--color);
  border: none;
  border-radius: 100%;
}

:deep(.vuejs3-datepicker__calendar-actionarea .cell.day:hover) {
  border: none !important;
  background-color: rgb(68, 71, 75);
  border-radius: 100%;
}

:deep(#calendar-div) {
  font-size: 15px;
  color: var(--color);
  background-color: #1a1a1a;;
  border-radius: 8px;
  padding: 8px 15px;
  border: 1px solid transparent;
  height: 30px;
  width: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.25s;
}

:deep(#calendar-div:hover) {
  border-color: #646cff;
}

:deep(.vuejs3-datepicker__value) {
  border: none;
  display: flex;
  justify-content: center;
}

:deep(.vuejs3-datepicker__icon),
:deep(.vuejs3-datepicker__content) {
  color: var(--color);
} 

:deep(.vuejs3-datepicker__icon) {
  display: none;
}

</style>

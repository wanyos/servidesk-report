<template>
  <section class="container__card">
    <img src="../assets/img-excel.png" alt="img_excel" />
    <p>{{ title }}</p>
  </section>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
});
</script>

<style lang="css" scoped>
.container__card {
  border: 1px solid rgb(23, 184, 101);
  padding: 1rem 2.5rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  cursor: pointer;
}

img {
  width: 70%;
  height: 70%;
  object-fit: cover;
  margin-top: 0.6rem;
}

p {
  font-size: 0.9rem;
  color: rgb(23, 184, 101);
}
</style>

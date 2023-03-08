<template>
  <div>
    <ErrorBoundary>
      <div class="default-container">
        <AppHeader />
        <div class="main-container">
          <Nuxt />
        </div>
        <AppFooter />
      </div>
    </ErrorBoundary>
  </div>
</template>

<script>
export default {

}
</script>
<style>

.default-container {
  height: 100vh;
  background-image: linear-gradient(to right bottom, rgba(2, 0, 36, 0.8), rgba(0, 212, 255, 0.8)), url("/img/hero.jpg");
  background-size: cover;
  background-position: top;
  padding: 0 40px;
}

.main-container {
    display: flex;
    height: 85vh;
    min-width: 100%;
    align-items: center;
    color: #FFF;
}
</style>
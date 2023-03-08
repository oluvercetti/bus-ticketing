<template>
    <div>
        <slot />
    </div>
</template>

<script>
export default {
    errorCaptured(err, vm, info) {
        this.$router.replace({ path: "/error" });
    },
};
</script>
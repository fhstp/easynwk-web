<template>
    <section v-if="visible" class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-content">
            <div class="notification is-warning">
                <h3 class="title">{{ t("sthwentwrong") }}</h3>
                
                <p class="block">
                    {{ t("formaterror") }}
                </p>
  
                <p class="block"> 
                    {{ t("checkformat") }}
                </p>
                <div class="buttons">
                    <button class="button" @click="$emit('close')">
                        <span class="icon">
                            <font-awesome-icon icon="times" />
                        </span>
                        <span>{{ t("close") }}</span>
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>
  
<script lang="ts">
import de from '@/de';
import en from '@/en';
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        visible: {
            type: Boolean,
            required: true
        }
    },
    mixins: [de, en],
    methods: {
        t(prop: string) {
            return this[document.documentElement.lang][prop];
        },
    },
  });
</script>
  
<style scoped lang="scss">
p {
    font-size: 60%;
    max-height: 10vh;
    overflow: auto;
}
</style>
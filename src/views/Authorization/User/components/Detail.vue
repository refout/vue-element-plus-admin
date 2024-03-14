<script setup lang="ts">
import { PropType } from 'vue'
import { Descriptions, DescriptionsSchema } from '@/components/Descriptions'
import { User } from '@/api/system/user'

defineProps({
  currentRow: {
    type: Object as PropType<User>,
    default: () => undefined
  },
  detailSchema: {
    type: Array as PropType<DescriptionsSchema[]>,
    default: () => []
  }
})
</script>

<template>
  <Descriptions :schema="detailSchema" :data="currentRow || {}" />
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { Descriptions, DescriptionsSchema } from '@/components/Descriptions'
import { Config } from '@/api/system/config'

defineProps({
  currentRow: {
    type: Object as PropType<Config>,
    default: () => undefined
  },
  detailSchema: {
    type: Array as PropType<DescriptionsSchema[]>,
    default: () => []
  }
})
</script>

<template>
  <Descriptions :data="currentRow || {}" :schema="detailSchema" />
</template>

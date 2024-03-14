<script lang="tsx" setup>
import { Table } from '@/components/Table'
import { Search } from '@/components/Search'
import { BaseButton } from '@/components/Button'
import { ContentWrap } from '@/components/ContentWrap'
import { Dialog } from '@/components/Dialog'
import { useTable } from '@/hooks/web/useTable'
import { Config, editApi, pageApi } from '@/api/system/config'
import { reactive, ref, Ref, unref } from 'vue'

import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import Write from '@/views/Authorization/Config/components/Write.vue'
import Detail from '@/views/Authorization/Config/components/Detail.vue'

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    const res = await pageApi({
      page: unref(currentPage),
      size: unref(pageSize),
      query: {
        data: unref(searchParams)
      }
    })

    return {
      list: res.data.data || [],
      total: res.data.total || 0
    }
  }
})
const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList } = tableMethods

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'selection',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      type: 'selection'
    }
  },
  {
    field: 'index',
    label: '序号',
    form: {
      hidden: true
    },
    search: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      type: 'index',
      align: 'center'
    }
  },
  {
    field: 'name',
    label: '配置名称'
  },
  {
    field: 'value',
    label: '配置值'
  },
  {
    field: 'belong',
    label: '配置所属功能'
  },
  {
    field: 'app',
    label: '配置所属应用',
    search: {
      hidden: true
    }
  },
  {
    field: 'remark',
    label: '备注'
  },
  {
    field: 'createTime',
    label: '创建时间'
  },
  {
    field: 'action',
    label: '操作',
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    search: {
      hidden: true
    },
    table: {
      width: 200,
      align: 'center',
      slots: {
        default: (data: any) => {
          const row = data.row as Config
          return (
            <>
              <BaseButton
                size="small"
                nativeType="submit"
                type="primary"
                onClick={() => action(row, 'edit')}
              >
                编辑
              </BaseButton>
              <BaseButton size="small" type="success" onClick={() => action(row, 'detail')}>
                详情
              </BaseButton>
            </>
          )
        }
      }
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const searchParams: Ref<Config | {}> = ref({})
const setSearchParams = (params: any) => {
  currentPage.value = 1
  searchParams.value = params
  getList()
}

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref<Config>()
const actionType = ref('')
const action = (row: Config, type: string) => {
  dialogTitle.value = type === 'edit' ? '编辑' : '详情'
  actionType.value = type
  currentRow.value = { ...row }
  dialogVisible.value = true
}

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    saveLoading.value = true
    try {
      const res = await editApi(formData as Config)
      if (res) {
        currentPage.value = 1
        await getList()
      }
    } catch (error) {
      console.log(error)
    } finally {
      saveLoading.value = false
      dialogVisible.value = false
    }
  }
}
</script>

<template>
  <ContentWrap>
    <Search :schema="allSchemas.searchSchema" @reset="setSearchParams" @search="setSearchParams" />

    <Table
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :columns="allSchemas.tableColumns"
      :data="dataList"
      :loading="loading"
      :pagination="{
        total
      }"
      @register="tableRegister"
    />
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Write
      v-if="actionType !== 'detail'"
      ref="writeRef"
      :current-row="currentRow"
      :form-schema="allSchemas.formSchema"
    />

    <Detail
      v-if="actionType === 'detail'"
      :current-row="currentRow"
      :detail-schema="allSchemas.detailSchema"
    />

    <template #footer>
      <BaseButton
        v-if="actionType !== 'detail'"
        :loading="saveLoading"
        type="primary"
        @click="save"
      >
        保存
      </BaseButton>
      <BaseButton @click="dialogVisible = false">关闭</BaseButton>
    </template>
  </Dialog>
</template>

<style lang="less" scoped></style>

<script lang="tsx" setup>
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
import { reactive, Ref, ref, unref } from 'vue'
import { saveUserApi } from '@/api/department'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { Dialog } from '@/components/Dialog'
import { getRoleListApi } from '@/api/role'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { BaseButton } from '@/components/Button'
import { changeUsageApi, deleteAllApi, pageApi, User } from '@/api/system/user'
import { ElMessage, ElSwitch } from 'element-plus'
import { genderOptionApi, usageOptionApi } from '@/api/common/option'

const { t } = useI18n()

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
  },
  fetchDelApi: async () => {
    const res = await deleteAllApi(unref(ids))
    return !!res
  }
})
const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList, getElTableExpose, delList } = tableMethods

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
    label: t('system.user.index'),
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
    field: 'username',
    label: t('system.user.username')
  },
  {
    field: 'nickname',
    label: t('system.user.nickname')
  },
  {
    field: 'phone',
    label: t('system.user.phone')
  },
  {
    field: 'email',
    label: t('system.user.email'),
    form: {
      component: 'Input'
    },
    search: {
      hidden: true
    }
  },
  {
    field: 'gender',
    label: t('system.user.gender'),
    formatter: (_: any, __: any, cellValue: any): string => cellValue.label,
    form: {
      component: 'Select',
      value: [],
      optionApi: async () => {
        const option = await genderOptionApi()
        return option.data || []
      }
    }
  },
  {
    field: 'state',
    label: t('system.user.state'),
    slots: {
      default: (data: any) => {
        return (
          <ElSwitch
            v-model={data.row.state.value}
            class="ml-2"
            inline-prompt
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            activeValue="0"
            inactiveValue="1"
            active-text="正常"
            inactive-text="停用"
            onChange={(v) => {
              changeUsageApi(data.row.id, v).then(() => {
                getList()
                ElMessage.success('修改成功')
              })
            }}
          />
        )
      }
    },
    search: {
      component: 'Select',
      value: [],
      optionApi: async () => {
        const option = await usageOptionApi()
        return option.data || []
      }
    },
    form: {
      component: 'Select',
      value: [],
      optionApi: async () => {
        const option = await usageOptionApi()
        return option.data || []
      }
    }
  },
  {
    field: 'role',
    label: t('system.user.role'),
    search: {
      hidden: true
    },
    form: {
      component: 'Select',
      value: [],
      componentProps: {
        multiple: true,
        collapseTags: true,
        maxCollapseTags: 1
      },
      optionApi: async () => {
        const res = await getRoleListApi()
        return res.data?.list?.map((v) => ({
          label: v.roleName,
          value: v.id
        }))
      }
    }
  },
  {
    field: 'createTime',
    label: t('userDemo.createTime'),
    form: {
      hidden: true
    },
    search: {
      hidden: true
    }
  },
  {
    field: 'action',
    label: t('userDemo.action'),
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
          const row = data.row as User
          return (
            <>
              <BaseButton
                size="small"
                nativeType="submit"
                type="primary"
                onClick={() => action(row, 'edit')}
              >
                {t('exampleDemo.edit')}
              </BaseButton>
              <BaseButton size="small" type="success" onClick={() => action(row, 'detail')}>
                {t('exampleDemo.detail')}
              </BaseButton>
              <BaseButton size="small" type="danger" onClick={() => delData(row)}>
                {t('exampleDemo.del')}
              </BaseButton>
            </>
          )
        }
      }
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const searchParams: Ref<User | {}> = ref({})
const setSearchParams = (params: any) => {
  currentPage.value = 1
  searchParams.value = params
  getList()
}

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref<User>()
const actionType = ref('')

const AddAction = () => {
  dialogTitle.value = t('exampleDemo.add')
  currentRow.value = undefined
  dialogVisible.value = true
  actionType.value = ''
}

const delLoading = ref(false)
const ids = ref<bigint[]>([])

const delData = async (row?: User) => {
  const elTableExpose = await getElTableExpose()
  ids.value = row ? [row.id] : elTableExpose?.getSelectionRows().map((v: User) => v.id) || []
  delLoading.value = true

  await delList(unref(ids).length).finally(() => {
    delLoading.value = false
  })
}

const action = (row: User, type: string) => {
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
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
      const res = await saveUserApi(formData)
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

    <div class="mb-10px">
      <BaseButton type="primary" @click="AddAction">{{ t('exampleDemo.add') }}</BaseButton>
      <BaseButton :loading="delLoading" type="danger" @click="delData()">
        {{ t('exampleDemo.del') }}
      </BaseButton>
    </div>
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
        {{ t('exampleDemo.save') }}
      </BaseButton>
      <BaseButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</BaseButton>
    </template>
  </Dialog>
</template>

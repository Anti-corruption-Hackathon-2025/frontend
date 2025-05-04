<template>
  <section v-if="tender" class="flex flex-col container items-center mx-auto gap-3 p-5">
    <div class="flex items-center gap-3">
      <p>ID: <span class="font-bold">№{{ tender.lot_number }}</span></p>
      <p>Date: <span class="font-bold">{{ formatDate(tender.consumer.date) }}</span></p>
    </div>
    <h1 class="text-lg font-bold text-center md:text-2xl">
      {{ tender.title }}
    </h1>
    <h2 class="text-xl text-center">
      {{ tender.consumer.name }}
    </h2>
    <n-button @click="showDialog = true" class="!text-white" size="large" type="primary">
      Принять участие
    </n-button>
    <div class="grid w-full items-center gap-3 md:grid-cols-2 xl:grid-cols-4 pt-3">
      <Card class="flex flex-col items-center text-center p-5">
        <div class="pb-3">До окончания осталось:</div>
        <Countdown :end="tender.end_date" />
      </Card>
      <Card class="flex flex-col h-full items-center text-center gap-3 p-5">
        <div>Дата начала:</div>
        <div class="flex-1" style="min-height: 20px;"></div>
        <span class="text-2xl text-green-500">{{ formatDateTime(tender.start_date) }}</span>
      </Card>
      <Card class="flex flex-col h-full min-h-[140px] items-center text-center gap-3 p-5">
        <div>Дата окончания:</div>
        <div class="flex-1" style="min-height: 20px;"></div>
        <span class="text-2xl text-red-500">{{ formatDateTime(tender.end_date) }}</span>
      </Card>
      <Card class="flex flex-col h-full items-center text-center gap-3 p-5">
        <div>Стартовая стоимость:</div>
        <div class="flex-1" style="min-height: 20px;"></div>
        <span class="text-2xl">{{ formatPrice(tender.start_price) }}.00 UZS</span>
      </Card>
    </div>
    <Card class="flex flex-col w-full p-5">
      <div class="font-semibold text-lg">Детальная информация:</div>
      <n-space class="pt-3" vertical :size="12">
        <n-config-provider :theme-overrides="themeOverrides">
          <n-data-table
              :bordered="false"
              :single-line="false"
              :columns="columns"
              :data="tableData"
              class="custom-table"
          />
        </n-config-provider>
      </n-space>
    </Card>
    <Card class="flex flex-col w-full p-5">
      <div class="font-semibold text-lg">Участники:</div>
      <n-space class="pt-3" vertical :size="12">
        <n-config-provider :theme-overrides="themeOverrides">
          <n-data-table
              :bordered="false"
              :single-line="false"
              :columns="positionColumns"
              :data="positionTableData"
              class="custom-table"
          />
        </n-config-provider>
      </n-space>
    </Card>
    <Card class="flex flex-col w-full p-5">
      <div class="font-semibold text-lg pb-5">Информация о лоте:</div>
      <div class="flex flex-col gap-3">
        <div class="flex gap-2">
          <p class="text-end">ИНН:</p>
          <p class="font-bold">{{ tender.consumer.tin }}</p>
        </div>
        <div class="flex gap-2">
          <p class="text-end">Юр. Адрес:</p>
          <p class="font-bold">{{ tender.consumer.address }}</p>
        </div>
        <div class="flex gap-2">
          <p class="text-end">Имя:</p>
          <p class="font-bold">{{ tender.consumer.creator.name }}</p>
        </div>
        <div class="flex gap-2">
          <p class="text-end">Дата начала:</p>
          <p class="font-bold">{{ formatDateTime(tender.start_date) }}</p>
        </div>
        <div class="flex gap-2">
          <p class="text-end">Дата окончания:</p>
          <p class="font-bold">{{ formatDateTime(tender.end_date) }}</p>
        </div>
      </div>
    </Card>
  </section>

  <n-modal
      v-model:show="showDialog"
      title="Тендер">
    <n-card class="w-128!" @close="showDialog = false" title="Участие" closable>
      <div class="flex flex-col gap-3 pb-5">
        <template v-if="loader == true"> <NodeTreeLoader /></template>
        <template v-else-if="hasError == true">
          <div class="flex items-center gap-2">
            <PhXCircle :size="32" color="#FF0000"  />
            <div class="text-red-500 text-xl">Был распосзнан конфликт интересов!</div>
          </div>
        </template>
        <template v-else>
          <n-input-number placeholder="Введите сумму" v-model:value="amount" />
          <n-button @click="handleConfirm" class="!text-white" size="medium" type="primary">
            Подтвердить
          </n-button>
        </template>
      </div>
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
import Card from '../../components/Card.vue';
import {type DataTableColumns, NCard, NInputNumber, NModal, useMessage} from 'naive-ui';
import {NSpace, NDataTable, NTag, NConfigProvider, NButton} from "naive-ui";
import Countdown from "../../components/Countdown.vue";
import {PhXCircle} from "@phosphor-icons/vue";
import { ref, onMounted, h } from 'vue';
import {useRoute} from "vue-router";
import {type Tender, type TenderItem, type TenderPosition, useTender} from "../../composables/tender.ts";
import {formatDate, formatDateTime, formatPrice} from "../../composables/formater.ts";
import NodeTreeLoader from "../../components/NodeTreeLoader.vue";

const route = useRoute();
const tender = ref<Tender | null>(null)
const showDialog = ref(false);
const loader = ref(false);
const hasError = ref(false);
const handleClose = () => {
  showDialog.value = false;
};

const amount = ref<number>(0);
const message = useMessage();
const tenderService = useTender();

const loadTender = async () => {
  const _tender = await tenderService.getTender(Number(route.params.lot_number));
  tableData.value = _tender.items?.map((item) => ({
    quantity: item.quantity,
    unit: item.unit,
    category: item.categories,
    price: item.price
  }));

  tender.value = _tender
}

const loadTenderPositions = async () => {
  const _positions = await tenderService.getTenderPositions(Number(route.params.lot_number));
  positionTableData.value = _positions.map((item) => ({
    tin: item.organization.tin,
    name: item.organization.name,
    address: item.organization.address,
    price: item.price
  }));

  tender.value = _positions
}

const organizationCaseCea = { tin: 12345678901234, name: "Insurance Company", creator: {name: "Jasur Hasanov", pinfl: 88990011223344}, address: "Muminov Street 4AA", cea: 12345, date: 957415079000}
const organizationCaseRelative = { tin: 12345678901234, name: "Insurance Company", creator: {name: "Jasur Hasanov", pinfl: 77665544332211}, address: "Muminov Street 4AA", cea: 10320, date: 957415079000}
const organizationCaseAddress = { tin: 12345678901234, name: "Insurance Company", creator: {name: "Jasur Hasanov", pinfl: 88990011223344}, address: "Muminov Street 4A", cea: 10320, date: 957415079000}
const organizationCaseSuccess = { tin: 12345678901234, name: "Insurance Company", creator: {name: "Jasur Hasanov", pinfl: 88990011223344}, address: "Muminov Street 4AA", cea: 10320, date: 957415079000}

const handleConfirm = async () => {
  loader.value = true;
  setTimeout(async () => {
    try {
      await tenderService.createPosition(Number(route.params.lot_number), organizationCaseSuccess, amount.value);
      message.success('Подтверждено');
      handleClose();
    } catch (error) {
      console.log(error);
      hasError.value = true;
    } finally {
      loader.value = false;
    }
  }, 2500)
};

const columns: DataTableColumns<TenderItem> = [
  {
    title: 'Кол-во товара',
    key: 'quantity'
  },
  {
    title: 'Ед. измерения',
    key: 'unit'
  },
  {
    title: 'Категория',
    key: 'categories',
    render(row) {
      return row.category.map((categoryKey) =>
          h(
              NTag,
              {
                style: {
                  marginRight: '6px',
                  background: '#50C87850',
                  color: '#50C878'
                },
                type: 'info',
                bordered: false
              },
              { default: () => categoryKey }
          )
      )
    }
  },
  {
    title: 'Общая сумма',
    key: 'price'
  }
]

const positionColumns: DataTableColumns<TenderItem> = [
  {
    title: 'ИНН',
    key: 'tin'
  },
  {
    title: 'Имя',
    key: 'name'
  },
  {
    title: 'Адрес',
    key: 'address',
  },
  {
    title: 'Сумма',
    key: 'price'
  }
]

const tableData = ref<TenderItem[]>([]);
const positionTableData = ref<TenderPosition[]>([]);

onMounted(() => {
  loadTender();
  loadTenderPositions();
})

const themeOverrides = {
  DataTable: {
    baseColor: '#fff',
    tdColor: '#00000020',
    tdColorStriped: '#f8f8f8',
    borderColor: '#384959',
    tdTextColor: '#fff',
    thColor: '#384959',
    thTextColor: '#fff',
  },
};
</script>


<style scoped>
.custom-table {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.custom-table :deep(.n-data-table-th) {
  font-weight: 600;
}
</style>
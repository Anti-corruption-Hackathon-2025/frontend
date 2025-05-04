<template>
  <div class="top-section flex flex-col items-center p-8">
    <n-modal
        v-model:show="showDialog"
        @positive-click="handlePositiveClick"
        @negative-click="handleNegativeClick"
        title="Tender Form"
        content="Are you sure?"
        negative-text="Cancel"
        positive-text="Submit">
      <n-card class="w-128!" @close="showDialog = false" title="Tender Form" closable>
        <div class="flex flex-col gap-3">
          <n-input v-model:value="title" type="text" placeholder="Title" />
          <n-input
              v-model:value="description"
              type="textarea"
              placeholder="Description"
          />
          <n-date-picker
              v-model:value="range"
              type="daterange"
              clearable
          />
          <n-input-number placeholder="Maximum cost" />
          <n-button @click="handleCreate" class="!text-white" size="medium" type="primary">
            Create Tender
          </n-button>
        </div>
      </n-card>
    </n-modal>
    <div class="text-center text-4xl mb-8">
      BLOCKCHAIN BASED TENDER SYSTEM
    </div>
    <div class="text-center">
      <div class="inline-block max-w-[80%]">
        A blockchain-based tender system is a digital platform where all stages of the tendering process—announcement, bid submission, evaluation, and award—are securely recorded on a tamper-proof, decentralized ledger. It uses smart contracts to automate deadlines and ensure bids are evaluated fairly without human bias.
      </div>
    </div>
  </div>

  <div class="container mx-auto mt-4 px-4">
    <section class="grid grid-cols-12 gap-4">
      <Card
          class="col-span-6 cursor-pointer"
          v-for="tender in tenders"
          :key="tender.lot_number"
          hoverable
          @click="router.push(`/tenders/${tender.lot_number}`)"
      >
      <div class="flex flex-col h-full">
      <div class="flex-1">
        <div class="flex text-white/40 gap-2">
          <div>№{{ tender.lot_number }}</div>
          <div>{{ formatDate(tender.consumer.date) }}</div>
        </div>
        <div class="text-white/80 text-lg line-clamp-2">
          {{ tender.title }}
        </div>
        <div class="text-white/70">
          {{ tender.consumer.name }}
        </div>
        <div class="flex flex-1 flex-col" />
      </div>
      <div>
        <div class="border-b border-white/20 my-2"></div>
        <div class="flex justify-between">
          <div class="flex flex-col items-center">
            <div class="text-white/40">STARTING DATE</div>
            <div>{{ formatDate(tender.start_date) }}</div>
          </div>
          <div class="flex flex-col items-center">
            <div class="text-white/40">ENDING DATE</div>
            <div>{{ formatDate(tender.end_date) }}</div>
          </div>
          <div class="flex flex-col items-center">
            <div class="text-white/40">CEA</div>
            <div>{{ tender.cea }}</div>
          </div>
          <div class="flex flex-col items-center">
            <div class="text-white/40">STARTING COST</div>
            <div class="font-medium text-emerald-500">{{ formatPrice(tender.start_price) }}.00 UZS</div>
          </div>
        </div>
      </div>

      </div>
      </Card>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import Card from '../../components/Card.vue';
import {NButton, NDatePicker, NModal, NCard, NInput, NInputNumber} from "naive-ui";
import { useMessage } from 'naive-ui';
import {useRouter} from "vue-router";
import {useTender, type Tender} from "../../composables/tender.ts";
import {formatDate, formatPrice} from "../../composables/formater.ts";

const router = useRouter();

const range = ref<[number, number] | null>(null);
const title = ref<string>('');
const description = ref<string>('');
const showDialog = ref(false);
const message = useMessage();

const tenders = ref<Tender[]>([]);
const tenderService = useTender();

onMounted(() => {
  loadTenders();
})

const loadTenders = async () => {
  tenders.value = await tenderService.getTenders();
}

const handleClose = () => {
  showDialog.value = false;
}

const handleCreate = () => {
  handleClose();
};

const handlePositiveClick = () => {
  message.success('Confirm');
  handleClose();
}

const handleNegativeClick = () => {
  message.warning('Cancel')
  handleClose();
}

</script>

<style scoped>
.top-section {
  background: linear-gradient(180deg, rgba(26, 37, 57, 1) 18%, rgba(16, 24, 40, 1) 81%);
}
</style>
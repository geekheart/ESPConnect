<template>
  <div v-if="!partitionSegments.length" class="partitions-empty">
    <v-card class="partitions-empty__card partitions-empty__card--disconnected" variant="tonal">
      <v-card-text class="partitions-empty__body">
        <v-avatar class="partitions-empty__avatar" size="70">
          <v-icon size="34">mdi-table-refresh</v-icon>
        </v-avatar>
        <div class="partitions-empty__text">
          <div class="partitions-empty__title">{{ $t("partitions.empty.title") }}</div>
          <div class="partitions-empty__subtitle">
            {{ $t("partitions.empty.subtitle") }}
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
  <div v-else class="partition-view">
    <v-card variant="tonal" prepend-icon="mdi-table">
      <template v-slot:title>
        <span class="font-weight-black">{{ partitionCardTitle }}</span>
      </template>
      <!-- 未使用空间提示框 - 改造翻译 -->
      <v-alert v-if="showUnusedAlert" type="warning" variant="tonal" class="unused-alert">
        <div>
          Unused flash detected - about {{ unusedReadable }} ({{ unusedBytesDisplay }} bytes) is reclaimable.
        </div>
        <div>
          See the
          <a href="https://youtu.be/EuHxodrye6E" target="_blank" rel="noopener noreferrer">
            partition tutorial
          </a>
          or try the
          <a href="https://thelastoutpostworkshop.github.io/microcontroller_devkit/esp32partitionbuilder/"
            target="_blank" rel="noopener noreferrer">
            ESP32 partition builder
          </a>.
        </div>
      </v-alert>
      <!-- 自定义布局提示框 - 改造翻译 -->
      <v-alert v-else type="info" variant="tonal" class="unused-alert">
        Want to customize this layout? Watch the
        <a href="https://youtu.be/EuHxodrye6E" target="_blank" rel="noopener noreferrer">
          partition tutorial
        </a>
        or open the
        <a href="https://thelastoutpostworkshop.github.io/microcontroller_devkit/esp32partitionbuilder/"
          target="_blank" rel="noopener noreferrer">
          ESP32 partition builder
        </a>.
      </v-alert>
      <!-- 分区可视化地图 - 改造空状态翻译 -->
      <div class="partition-map">
        <VTooltip v-for="segment in partitionSegments" :key="segment.key" location="top" :open-delay="120"
          transition="fade-transition">
          <template #activator="{ props }">
            <div v-bind="props" :class="[
              'partition-segment',
              {
                'partition-segment--unused': segment.isUnused,
                'partition-segment--reserved': segment.isReserved,
              },
            ]" :style="{
              width: segment.width,
              flexBasis: segment.width,
              backgroundColor: segment.color,
              backgroundImage: segment.backgroundImage || undefined,
            }">
              <span v-if="segment.showLabel" class="partition-label">
                {{ segment.label || $t("partitions.label.unnamed") }}
              </span>
              <span v-if="segment.showMeta" class="partition-meta">
                {{ segment.sizeText }} - {{ segment.offsetHex }}
              </span>
            </div>
          </template>
          <template #default>
            <div class="partition-tooltip">
              <div class="partition-tooltip__title">{{ segment.label || $t("partitions.label.unnamed") }}</div>
              <div v-for="line in segment.tooltipLines" :key="line" class="partition-tooltip__line">
                {{ line }}
              </div>
            </div>
          </template>
        </VTooltip>
      </div>
      <!-- 分区表格 - 改造表头翻译 -->
      <v-table density="comfortable" class="mt-4">
        <thead>
          <tr>
            <th>{{ $t("partitions.table.header.label") }}</th>
            <th>{{ $t("partitions.table.header.type") }}</th>
            <th>{{ $t("partitions.table.header.subtype") }}</th>
            <th>{{ $t("partitions.table.header.offset") }}</th>
            <th>{{ $t("partitions.table.header.size") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in formattedPartitions" :key="entry.offset" class="partition-table-row">
            <td>
              <div class="partition-table-label">
                <span class="partition-color-pip" :style="{
                  backgroundColor: entry.color,
                  backgroundImage: entry.backgroundImage || undefined,
                }"></span>
                <span>{{ entry.label || $t("partitions.label.unnamed") }}</span>
              </div>
            </td>
            <td>{{ entry.typeLabel }}</td>
            <td>{{ entry.subtypeLabel }}</td>
            <td>{{ entry.offsetHex }}</td>
            <td>{{ entry.sizeText }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </div>
</template>

<script setup>
import { computed, toRefs } from 'vue';
import { useI18n } from 'vue-i18n'; // 引入i18n

// 初始化i18n
const { t } = useI18n();

const props = defineProps({
  partitionSegments: {
    type: Array,
    default: () => [],
  },
  formattedPartitions: {
    type: Array,
    default: () => [],
  },
  unusedSummary: {
    type: Object,
    default: null,
  },
  flashSizeLabel: {
    type: String,
    default: '',
  },
});

const { partitionSegments, formattedPartitions, unusedSummary, flashSizeLabel } = toRefs(props);

// 计算属性 - 保持原有逻辑，替换硬编码文本为翻译调用
const showUnusedAlert = computed(() => Boolean(unusedSummary.value));
const unusedReadable = computed(() => unusedSummary.value?.readable ?? '');
const unusedBytesDisplay = computed(() =>
  unusedSummary.value?.bytes != null ? unusedSummary.value.bytes.toLocaleString() : ''
);
const partitionCardTitle = computed(() => {
  const label = flashSizeLabel.value?.trim();
  return label ? `Partitions · ${label}` : 'Partitions';
});
</script>

<style scoped>
.partition-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.partitions-empty {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 260px;
}

.partitions-empty__card {
  border-radius: 18px;
  padding: 28px 32px;
  border: 1px dashed color-mix(in srgb, var(--v-theme-primary) 20%, transparent);
  background: color-mix(in srgb, var(--v-theme-surface) 94%, transparent);
  text-align: center;
  max-width: 420px;
}

.partitions-empty__card--disconnected {
  border-style: solid;
  border-color: color-mix(in srgb, var(--v-theme-error) 40%, transparent);
  background: color-mix(in srgb, var(--v-theme-error) 14%, var(--v-theme-surface) 92%);
}

.partitions-empty__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}

.partitions-empty__avatar {
  background: color-mix(in srgb, var(--v-theme-primary) 18%, transparent);
  color: color-mix(in srgb, var(--v-theme-primary) 80%, var(--v-theme-on-surface) 30%);
}

.partitions-empty__card--disconnected .partitions-empty__avatar {
  background: color-mix(in srgb, var(--v-theme-error) 26%, transparent);
  color: color-mix(in srgb, var(--v-theme-error) 85%, var(--v-theme-on-surface) 10%);
}

.partitions-empty__title {
  font-size: 1.02rem;
  font-weight: 600;
  color: color-mix(in srgb, var(--v-theme-on-surface) 92%, transparent);
}

.partitions-empty__subtitle {
  font-size: 0.92rem;
  color: color-mix(in srgb, var(--v-theme-on-surface) 65%, transparent);
}

.partition-map {
  display: flex;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--v-theme-on-surface) 12%, transparent);
  background: color-mix(in srgb, var(--v-theme-surface) 90%, transparent);
  flex-wrap: nowrap;
  min-height: 140px;
}

.partition-segment {
  position: relative;
  padding: 10px 12px;
  min-width: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
  min-width: 0;
  box-sizing: border-box;
  border-left: 1px solid rgba(255, 255, 255, 0.4);
  flex: 0 0 auto;
}

.partition-segment:first-child {
  border-left: none;
}

.partition-segment--unused {
  color: rgba(255, 255, 255, 0.88);
  background-repeat: repeat;
  background-size: 28px 28px;
}

.partition-segment--unused .partition-meta {
  opacity: 0.8;
}

.partition-segment--reserved {
  color: rgba(255, 255, 255, 0.92);
}

.partition-segment--reserved .partition-meta {
  opacity: 0.85;
}

.partition-tooltip {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 180px;
}

.partition-tooltip__title {
  font-weight: 600;
  font-size: 0.85rem;
}

.partition-tooltip__line {
  font-size: 0.78rem;
  opacity: 0.85;
}

.partition-table-row td {
  vertical-align: middle;
}

.partition-table-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.partition-color-pip {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background-size: 18px 18px;
  background-repeat: repeat;
}

.partition-label {
  font-weight: 600;
  font-size: 0.9rem;
  text-align: center;
  display: block;
  width: 100%;
}

.partition-meta {
  font-size: 0.75rem;
  opacity: 0.85;
}

/* 改造空状态文本为翻译（需配合全局样式或动态绑定，这里先保留占位） */
.partition-map:empty::before {
  content: attr(data-empty-text);
  padding: 16px;
  color: color-mix(in srgb, var(--v-theme-on-surface) 60%, transparent);
}

.unused-alert {
  margin-bottom: 8px;
}

.unused-alert a {
  color: inherit;
  text-decoration: underline;
}
</style>

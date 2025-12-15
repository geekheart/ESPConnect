<template>
  <div class="apps-tab">
    <v-alert
      v-if="activeSummary"
      type="info"
      variant="tonal"
      density="comfortable"
      border="start"
      class="mb-4"
    >
      {{ activeSummary }}
    </v-alert>

    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      density="comfortable"
      border="start"
      class="mb-4"
    >
      {{ error }}
    </v-alert>

    <div v-if="loading" class="apps-tab__loading">
      <v-progress-circular indeterminate color="primary" size="28" />
      <span class="ms-3 text-body-2">{{ $t("appsTab.loadingText") }}</span>
    </div>

    <template v-else>
      <v-alert
        v-if="!apps.length"
        type="info"
        variant="tonal"
        density="comfortable"
        border="start"
      >
        {{ $t("appsTab.noPartitions") }}
      </v-alert>

      <div v-else class="apps-tab__list">
        <v-card v-for="app in apps" :key="app.key" class="apps-tab__card" variant="tonal">
          <v-card-title class="apps-tab__title">
            <div class="apps-tab__heading">
              <span class="text-subtitle-1">{{ app.label }}</span>
              <span class="text-caption text-medium-emphasis ms-3">{{ app.slotLabel }}</span>
            </div>
            <div class="apps-tab__chips">
              <v-chip v-if="app.isActive" color="success" size="small" variant="elevated">
                {{ $t("appsTab.chips.active") }}
              </v-chip>
              <v-chip v-if="!app.valid" color="warning" size="small" variant="outlined">
                {{ $t("appsTab.chips.encryptedInvalid") }}
              </v-chip>
            </div>
          </v-card-title>
          <v-card-subtitle class="apps-tab__subtitle">
            {{ $t("appsTab.subtitle", { offset: app.offsetHex, size: app.sizeText }) }}
          </v-card-subtitle>
          <v-card-text>
            <template v-if="app.valid">
              <div class="apps-tab__details">
                <div class="apps-tab__detail">
                  <span class="apps-tab__label">{{ $t("appsTab.details.project") }}</span>
                  <span class="apps-tab__value">{{ app.projectName || '—' }}</span>
                </div>
                <div class="apps-tab__detail">
                  <span class="apps-tab__label">{{ $t("appsTab.details.version") }}</span>
                  <span class="apps-tab__value">{{ app.version || '—' }}</span>
                </div>
                <div class="apps-tab__detail">
                  <span class="apps-tab__label">{{ $t("appsTab.details.built") }}</span>
                  <span class="apps-tab__value">
                    {{ app.built || [app.buildDate, app.buildTime].filter(Boolean).join(' ') || '—' }}
                  </span>
                </div>
                <div class="apps-tab__detail">
                  <span class="apps-tab__label">{{ $t("appsTab.details.idfCore") }}</span>
                  <span class="apps-tab__value">{{ app.idfVersion || '—' }}</span>
                </div>
                <div class="apps-tab__detail">
                  <span class="apps-tab__label">{{ $t("appsTab.details.entryAddress") }}</span>
                  <span class="apps-tab__value">{{ app.entryAddressHex || '—' }}</span>
                </div>
                <div class="apps-tab__detail">
                  <span class="apps-tab__label">{{ $t("appsTab.details.segments") }}</span>
                  <span class="apps-tab__value">
                    {{ app.segmentCount != null ? app.segmentCount : '—' }}
                  </span>
                </div>
              </div>
              <div v-if="!app.descriptorFound" class="text-caption text-medium-emphasis mt-2">
                {{ $t("appsTab.descriptorNotFound") }}
              </div>
            </template>
            <template v-else>
              <v-alert type="warning" variant="tonal" density="comfortable" border="start">
                {{ app.error || $t("appsTab.invalidImageHeader") }}
              </v-alert>
            </template>
          </v-card-text>
        </v-card>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'; // 引入i18n

// 初始化i18n
const { t } = useI18n();

defineProps({
  apps: {
    type: Array,
    default: () => [],
  },
  activeSlotId: {
    type: String,
    default: null,
  },
  activeSummary: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: null,
  },
});
</script>

<style scoped>
.apps-tab__loading {
  display: flex;
  align-items: center;
  padding: 12px 4px;
}

.apps-tab__list {
  display: grid;
  gap: 16px;
}

.apps-tab__card {
  width: 100%;
}

.apps-tab__title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.apps-tab__chips {
  display: flex;
  gap: 8px;
}

.apps-tab__details {
  display: grid;
  gap: 8px;
}

@media (min-width: 960px) {
  .apps-tab__details {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.apps-tab__detail {
  display: flex;
  flex-direction: column;
  padding: 4px 0;
}

.apps-tab__label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: rgba(0, 0, 0, 0.54);
}

.apps-tab__value {
  font-size: 0.95rem;
}

:deep(.v-theme--dark) .apps-tab__label {
  color: rgba(255, 255, 255, 0.64);
}

:deep(.v-theme--dark) .apps-tab__value {
  color: rgba(255, 255, 255, 0.92);
}

.apps-tab__subtitle {
  padding-bottom: 0;
}
</style>
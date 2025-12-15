<template>
  <div :class="['about-tab', isDark ? 'about-tab--dark' : 'about-tab--light']">
    <v-card variant="tonal" class="mb-4">
      <v-card-title class="text-h6 d-flex align-center ga-2">
        <v-icon color="primary">mdi-chip</v-icon>
        {{ $t("about[0].title") }}
      </v-card-title>
      <v-card-text class="text-body-2">
        <p>
          {{$t("about[0].description[0]")}}
        </p>
        <p>
          {{ $t("about[0].description[1]") }}
        </p>
      </v-card-text>
    </v-card>

    <v-card variant="tonal" class="mb-4">
      <v-card-title class="text-subtitle-1">
        <v-icon start color="primary">mdi-folder-star-multiple</v-icon>
        {{ $t("about[1].title") }}
      </v-card-title>
      <v-card-text class="text-body-2">
        <ul class="about-list">
          <li>{{ $t("about[1].description[0]") }}</li>
          <li>{{ $t("about[1].description[1]") }}</li>
          <li>{{ $t("about[1].description[2]") }}</li>
          <li>{{ $t("about[1].description[3]") }}</li>
        </ul>
      </v-card-text>
    </v-card>

    <v-card variant="tonal" class="mb-4">
      <v-card-title class="text-subtitle-1">
        <v-icon start color="primary">mdi-flash</v-icon>
        {{ $t("about[2].title") }}
      </v-card-title>
      <v-card-text class="text-body-2">
        <ul class="about-list">
          <li>{{ $t("about[2].description[0]") }}</li>
          <li>{{ $t("about[2].description[1]") }}</li>
          <li>{{ $t("about[2].description[2]") }}</li>
        </ul>
      </v-card-text>
    </v-card>

    <v-card variant="tonal">
      <v-card-title class="text-subtitle-1">
        <v-icon start color="primary">mdi-shield-check</v-icon>
        {{ $t("about[3].title") }}
      </v-card-title>
      <v-card-text class="text-body-2">
        <p>
          {{ $t("about[3].description[0]") }}
        </p>
      </v-card-text>
    </v-card>

    <v-card variant="tonal">
      <v-card-title class="text-subtitle-1">
        <v-icon start color="primary">mdi-lock-check</v-icon>
        {{ $t("about[4].title") }}
      </v-card-title>
      <v-card-text class="text-body-2">
        <p>
          {{ $t("about[4].description[0]") }}
        </p>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useTheme } from 'vuetify';

const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);
</script>

<style scoped>
.about-tab {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  border-radius: 16px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  min-height: 100%;
}

.about-tab--light {
  background-image: url('/assets/images/about_back_light.png');
}

.about-tab--dark {
  background-image: url('/assets/images/about_back_dark.png');
}

.about-list {
  margin: 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.about-list strong {
  font-weight: 600;
}
</style>

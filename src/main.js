/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { createApp } from "vue";
import { createPinia } from 'pinia'

import App from "./App.vue";

const pinia = createPinia()
const app = createApp(App);

app.use(pinia)

app.mount("#app");

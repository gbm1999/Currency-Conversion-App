<script setup>
import { ref, onMounted } from "vue";

import round from "lodash/round";

import Fa from "vue-fa";
import { faRetweet, faArrowsRotate } from "@fortawesome/free-solid-svg-icons";

// Our backend endpoint.
const apiEndpoint = "http://localhost:5000/v1";

// From currency.
const fromCurrency = ref("EUR");
const fromValue = ref(1);

// To currency.
const toCurrency = ref("USD");
const toValue = ref(null);

// Supported currencies.
let currencies = ref({
  EUR: { code: "EUR", symbol: "€" },
  USD: { code: "USD", symbol: "$" },
});

// Error message to show.
const errorMessage = ref("");
var errorStatus = ref("");

// Clears the converted value.
const clear = () => {
  toValue.value = null;
};

// Swaps selected currencies.
const swap = () => {
  let tmp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = tmp;

  tmp = fromValue.value;
  fromValue.value = toValue.value;
  toValue.value = tmp;
};

// Display currencies
const show = async () => {
  //toValue.value = null;
  //fromCurrency.value = null; 
  //toCurrency.value = null;
  currencies.value = null;


  try {
    const response = await fetch(
      `${apiEndpoint}/currencies`,
      {
        method: "GET",
      }
    );
    if (!response.ok) {
      throw new Error(`Unexpected API response code: ${response.status}`);
    }
    const responseData = await response.json();
    currencies.value = responseData.currencies;
    errorMessage.value = "";
  } catch (error) {
    errorMessage.value = error.message;
  }
};

// Converts selected currencies.
const convert = async () => {
  toValue.value = null;

  try {
    const response = await fetch(
      `${apiEndpoint}/rate/${fromCurrency.value}/${toCurrency.value}`,
      {
        method: "GET",
      }
    );
    if (response.status == 403){
      errorStatus.value = "403";
      var timeOut = response.headers.get('x-ratelimit-reset');
      timeOut *= 1000;

      setTimeout(() => errorStatus.value = "", timeOut);
      throw new Error(`Unexpected API response code: ${response.status}`);
    }
    else if (!response.ok) {
      throw new Error(`Unexpected API response code: ${response.status}`);
    }
    else{

    }
    const responseData = await response.json();
    toValue.value = round(fromValue.value * responseData.rate, 4);

    errorMessage.value = "";
  } catch (error) {
    errorMessage.value = error.message;
  }
};

// On mount, convert default currencies.
onMounted(convert);
onMounted(show);
</script>

<template>
  <h1>Currency Conversion</h1>
  <form @submit.prevent="convert">
    <fieldset>
      <select v-model="fromCurrency" @input="clear">
        <option v-for="(v, k) in currencies" :key="k" :value="k">
          {{ k }}&nbsp;{{ v.symbol ?? "" }}
        </option>
      </select>
      <input
      :disabled="errorStatus.length > 0"
        v-model.number="fromValue"
        type="number"
        step="0.0001"
        min="0.0001"
        required
        autofocus
        @input="clear"
      />
    </fieldset>
    <fieldset>
      <select v-model="toCurrency" @input="clear">
        <option v-for="(v, k) in currencies" :key="k" :value="k">
          {{ k }}&nbsp;{{ v.symbol ?? "" }}
        </option>
      </select>
      <input v-model.number="toValue" type="number" readonly autofocus/>
    </fieldset>
    <fieldset>
      <button type="button" @click="swap">
        <fa :icon="faRetweet" fw />&nbsp;Swap
      </button>
      <button  :disabled="errorStatus.length > 0" type="submit">
        <fa :icon="faArrowsRotate" fw />&nbsp;Convert
      </button>
    </fieldset>
    <fieldset>
      <span v-if="errorMessage.length > 0">{{ errorMessage }}</span>
    </fieldset>
  </form>
</template>

<style lang="scss">
@import "./main.scss";

html {
  font-family: $system-sans-serif;
  font-size: $em-base-px;
  font-weight: 400;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

body {
  margin: 0;
  height: 100vh;
  color: map-get($theme-colors, "light");
  background-color: map-get($theme-colors, "dark");
}

#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: rem(10);
  min-height: 100%;

  h1 {
    font-size: rem(32);
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: rem(360);
  }

  button,
  input,
  select {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: rem(10);
    padding: 0 rem(10);
    min-height: rem(40);
    line-height: rem(40);
    font-size: rem(16);
    font-weight: 700;
    border: 0;
    border-radius: rem(3);
    color: map-get($theme-colors, "primary");
    background-color: map-get($theme-colors, "light");
    cursor: pointer;
    appearance: none;

    &:hover,
    &:focus {
      background-color: darken(map-get($theme-colors, "light"), 10%);
    }

    &:active {
      background-color: darken(map-get($theme-colors, "light"), 15%);
    }

    &:disabled {
      background-color: darken(map-get($theme-colors, "light"), 20%);
      cursor: not-allowed;
    }
  }

  button,
  input {
    width: 100%;
  }

  input[type="number"] {
    appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      appearance: none;
    }
  }

  fieldset {
    display: flex;
    flex-direction: row;
    margin: rem(10);
    padding: 0;
    width: 100%;
    border: 0;
    border-radius: rem(3);
    background-color: map-get($theme-colors, "light");

    > * {
      flex: 1 1 auto;
    }

    button,
    input,
    select {
      margin: 0;
    }
  }
}
</style>

<template>
  <div id="app">
    <h1 class="title">Welcome to Prime Graphs and ASMs</h1>

    <div class="tabs is-left">
      <ul>
        <li class="is-active">
          <router-link to="/">Home</router-link>
        </li>
        <li>
          <router-link to="/theory">Theory</router-link>
        </li>
        <li>
          <a href="https://github.com/navyhockey56/prime_graphs_and_asms/tree/vue">Code</a>
        </li>
      </ul>
    </div>

    <router-view/>
  </div>
</template>
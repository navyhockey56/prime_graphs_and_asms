<template>
  <div id="app">
    <h1 class="title">The Prime Graph and Awkward State Machines</h1>

    <div class="tabs is-left">
      <ul>
        <router-link tag="li" exact-active-class="is-active" to="/">
          <a>Home</a>
        </router-link>

        <router-link tag="li" exact-active-class="is-active" to="/canvas-asm">
          <a>Canvas Asm</a>
        </router-link>

        <router-link tag="li" exact-active-class="is-active" to="/theory">
          <a>Theory</a>
        </router-link>

        <li>
          <a href="https://github.com/navyhockey56/prime_graphs_and_asms/tree/vue">Code</a>
        </li>
      </ul>
    </div>

    <router-view/>
  </div>
</template>
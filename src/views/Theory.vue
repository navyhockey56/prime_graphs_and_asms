<template>
	<div>
    <p>
      An Awkward State Machine (ASM) is composed of two main types of objects:
    </p>
    <ul>
      <li>Cycles</li>
      <li>A Branch</li>
    </ul>
      <br>
      Each 'cycle' is composed of a list of nodes connected into a circle (think beads on a necklace).
      While a branch is a cycle that hasn't been connected into a circle yet (someone cut your bead necklacke,
      giving you a line segment). Currently, both cycles and branches will be represented as horizontal bars
      whose nodes consist of squares and circles.<br>

      Both cycles and branches keep track of a position node. When the ASM moves from one state to the next,
      each cycle's position is moved one node to the right (if you are at the rightmost position, the position
      gets set to the leftmost node). After moving every cycle in the ASM, the ASM checks whether or not it is
      'active'. An ASM is considered active if one of its cycle's position is on one of its activator nodes; thus
      an ASM is 'inactive' only if all of the cycles' position's are on non-activator nodes.<br>
      <br>
      If the ASM is 'inactive' after moving every cycle, then the following will occur:
      <ul>
        <li>The current branch will be copied</li>
        <li>
          The original branch will be closed into a cycle. It's position will be set to 0 (its leftmost nodes)
          and that will activate the ASM.
        </li>
        <li>The copied branch becomes the only branch.</li>
        <li>
          A new node is added to the end of the branch (the new node becomes the rightmost node). The branch's
          position is set on the new node.
        </li>
      </ul>
      <br>
      If the ASM was 'active' after moving every cycle, then:
      <ul>
        <li>
          A new node is added to the end of the branch (the new node becomes the rightmost node). The branch's
          position is set on the new node.
        </li>
      </ul>
      <br>
      Therefore, regardless of whether the ASM was inactive/active, a new node is added to the ASM every iteration.
      <br>
      <br>
      The initial state of an ASM consists of an initial cycle and a branch. When definining an ASM, you must first
      define the number of activator nodes it will contain, and the number of non-activator nodes the
      initial cycle will have (see below). The first (leftmost) nodes of an ASM's cycle are always the activator
      nodes, which are then followed by the non-activator nodes. Finally, the initial branch is one node longer than
      the initial cycle (#activator + #non-activator + 1).
    <p></p>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
	name: 'Theory'
});
</script>
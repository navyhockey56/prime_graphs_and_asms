# Prime Graphs
This project uses a state machine to determine the prime numbers. There is no addition, multiplication, or any other standard integer arithmetic needed to operate the state machine.

### How it works
We are going to iteratively build a directed graph called the Prime-Graph. The Prime-Graph is composed of cycles of various lengths all sharing a single point in common, the common point will be referred to as the center.

The Prime-Graph is self-building. We start with the center and then using the state-machine currently defined by the Prime-Graph, we add more points to the graph. It it difficult to quantify the Prime-Graph without knowing everything about it; as such, please bear with me as I list off the relevant information:

- For each cycle in the graph, one of the points within the cycle is 'on' and all other points are 'off'. At the next iteration, the 'on'  point will be switched to 'off' and it's adjacent point will be switched to 'on'.

- There exists an unfinished cycle at the start of each iteration. At the end of the iteration that cycle will either be connected to the center (thus completing the cycling) or another point will be added to the end of the unfinished cycle. The end of an unfinished cycle is always the 'on' point. If the unfinished cycle is connected to the center, then a new unfinished cycle will be created of the same length and then the new point will be added to that cycle. Thus, every iteration adds a new point to the graph, making the length of the unfinished cycle equal to the iteration the graph is on.

- The unfinished cycle should be completed at the end of the iteration if and only if the center is 'off' after all the other cycles have moved. In this event, the unfinished cycle is connected to the center, and then it moves, thus turning the center on. (Thus, the center is always 'on' at the end of every iteration [other than the first iteration]).

### Relationship to primes
Each of the completed cycles produced by running the Prime-Graph reprents a unique prime number. The prime number a cycle represents is equal to the number of points within it (thus, the state machine produces cycles of prime length). Furthermore, the cycles are produced in consequetive order (2, 3, 5, 7, ...). 

#### Why is this?
Since all cycles start at the center in the 'on' position, and we move the 'on' position to the next adjacent for each cycle, all the cycles within the graph are 'in-sync' (the way we create each new unfinished cycle preserves the synchronization). This implies that for each cycle, the distance from the center to the 'on' point is equal to the `current_iteration` moded by the `cycle_length`. Therefor, if the current iteration results with the 5-cycle's 'on' position being the center, then we know the current iteration is divisible by 5. Furthermore, if the iteration results in none of the previously completed cycles 'on' position being the center, then the current iteration is not divisible by any of the previous cycle lengths. Thus, by connecting the currently unfinished cycle to the center, we are creating a new completed cycle that has the length of this undivisible size. This new cycle's length is relatively prime to all the previous lengths; and since we started on iteration 1, the numbers we find are actually the primes.

### Technicality
I said there'd be no arithmetic needed for the Prime-Graph, and I'm technically right - the result of running the Prime-Graph algorithm is a list of completed graphs. As such, you don't know what the prime numbers are when the algorithm finishes; instead, you just have a list of graphs that represent the prime numbers. To get the actual prime numbers, you have to run the size method on each cycle, and the size method has to use addition in order to count the number of points. Furthermore, the algorithm requires the number of iterations you want to run, and thus we need to keep track of another counter with addition; however, if you had a computer with infinite memory, you would never need to halt the algorith, and thus you would not need to keep track of a counter (however, the algorithm would never complete).

### Confused?
If you're confused, try drawing out the Prime-Graph by hand! You can also try modifying the algorithm to print out the current state of things for each iteration.

![alt text](https://raw.githubusercontent.com/navyhockey56/prime_graphs/master/PrimeGraphProgression.png)
![alt text](https://raw.githubusercontent.com/navyhockey56/prime_graphs/master/PrimeGraphProgression2.png)
![alt text](https://raw.githubusercontent.com/navyhockey56/prime_graphs/master/PrimeGraphProgression3a.png)

### Running
To run the Prime-Graph algorithm, simply load the progam into a ruby seesion, create a PrimeGraph and call run_machine:
```ruby
load 'prime_graphs.rb'
prime_graph = PrimeGraph::PrimeGraph.new
prime_graph.run_machine 500
puts "The first #{prime_graph.cycles.count} primes are: #{prime_graph.primes}"
```

### Analysis
Let `p(n) = the number of primes less than or equal to n.`  


#### Fully-connected 

Each iteration, `i`, the algorithm will need to:  
1. Move each existing cycle.  
2. Check if any existing cycle is on the center.
3. Add the new node.  

Step `1` will always require `p(i)` operations, and step `2` will require at most `p(i)` operations. Thus, between steps `1` and `2` we will perform at most `2p(i)` operations. Step `3` has a constant number of iterations, `c`.

Thus, to run the algorithm for the first `n` iterations, the number of operations, `o(n)`, is given by:
`o(n) <= Sum[i=1, n]{ 2p(i) + c } = 2*Sum[i=1, n]{ p(i) } + n*c <= 2*Sum[i=1, n]{ i } + n+c = n*(n+1) + n*c = n^2 + n*(c + 1)`.  

Furthermore, the number of nodes within the fully-connected graph on for any iteration, `i`, is `i` itself. Thus, the size of the fully-connected graph grows linearly!


# Awkward State Machines
Time to generalize! 

### Framing
What if instead of starting with a branch of length 1 extending from our center, we started with a branch of length 2 or 3, or any other number?  For example, what if our initial state looked like:`[center : off] -> (node 1 : off) -> ... -> (node n : on)`.

Simarily, what if instead of starting with a single center, we started with 2 or more nodes that activated our machine? For example, what if our initial state looked like: `[activator 1 : off] -> ... -> [activator n : off] -> (node 1 : off) -> ... (node m : off)`.

We will refer to these machines as `Awkward State Machines` or `ASM`s. When referring to a specific machine, we include the number of activators, `m`, it has; and the length, `n`, of it's initial branch `ASM<n, m>`. Please note, the initial branches length is equal to the number of non-activator nodes only! For example, the inital state of `ASM<2, 2>` is given by: `[activator 1 : off] -> [activator 2 : off] -> (node 1 : off) -> (node 2 : on)`.

An `ASM` behaves the same way as the `Prime Graph` (in fact, the Prime Graph is equal to `ASM<1,1>`!). As such, a new node is added each iteration, the branch is copied and closed into a cycle whenever the machine is not active (thus activating the machine). Given these familiar properties, we know that the length of the branch for any given state is equal to the state's iteration, `i`, plus the length of the initial branch `m` (`branch_length = i + m`).

### Usage
Creating a new `ASM<n,m>` is simple:
```ruby
number_of_activators = 2
initial_branch_length = 3
asm_2_3 = AwkwardMath::AwkwardStateMachine.new(2, 3)
```

You can then move your machine to the next state using:
```ruby
# Move ahead to the next state
asm_2_3.next_state

# Move ahead the next 100 states
asm_2_3.run_machine 100
```

At any point, you can check the length of cycles discovered by your `ASM` with the `lengths` method which will return an array of all the cycle lengths:
```ruby
asm_2_3.lengths # -> [5, 7, 9, 12, 17, 23, 32, 38, 44, 53, 58, 62, 67, 74, 79, 83, 87, 94, 104]
```

#### Prime Graph Shortcut
You can shortcut creating a new prime graph, `ASM<1,1>`, using:
```ruby
pg = AwkwardMath.prime_graph
pg.run_machine 100
pg.to_s
# => "ASM<1, 1> -> [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101]"
```

### The first 100 iterations
```
ASM<1, 1> -> [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101]
ASM<1, 2> -> [3, 4, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101]
ASM<1, 3> -> [4, 5, 6, 7, 9, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103]
ASM<1, 4> -> [5, 6, 7, 8, 9, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103]
ASM<1, 5> -> [6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 25, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103]
ASM<1, 6> -> [7, 8, 9, 10, 11, 12, 13, 15, 17, 19, 23, 25, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103]
ASM<1, 7> -> [8, 9, 10, 11, 12, 13, 14, 15, 17, 19, 21, 23, 25, 29, 31, 35, 37, 41, 43, 47, 49, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107]
ASM<1, 8> -> [9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 21, 23, 25, 29, 31, 35, 37, 41, 43, 47, 49, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107]
ASM<1, 9> -> [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 23, 25, 27, 29, 31, 35, 37, 41, 43, 47, 49, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109]
ASM<2, 1> -> [3, 5, 8, 14, 23, 38, 44, 53, 59, 62, 68, 74, 83]
ASM<2, 2> -> [4, 6, 10, 14, 22, 26, 34, 38, 46, 58, 62, 74, 82, 86, 94]
ASM<2, 3> -> [5, 7, 9, 12, 17, 23, 32, 38, 44, 53, 58, 62, 67, 74, 79, 83, 87, 94, 104]
ASM<2, 4> -> [6, 8, 10, 14, 22, 26, 34, 38, 46, 58, 62, 74, 82, 86, 94]
ASM<2, 5> -> [7, 9, 11, 13, 16, 20, 24, 30, 38, 47, 51, 58, 62, 68, 74, 83, 86, 93]
ASM<2, 6> -> [8, 10, 12, 14, 18, 22, 26, 34, 38, 46, 58, 62, 74, 82, 86, 94, 106]
ASM<2, 7> -> [9, 11, 13, 15, 17, 20, 24, 29, 32, 38, 42, 47, 50, 57, 62, 70, 74, 83, 93, 98, 107]
ASM<2, 8> -> [10, 12, 14, 16, 18, 22, 26, 34, 38, 46, 58, 62, 74, 82, 86, 94, 106]
ASM<2, 9> -> [11, 13, 15, 17, 19, 21, 24, 28, 32, 36, 41, 47, 50, 54, 59, 62, 70, 74, 80, 87, 93, 98, 107]
ASM<3, 1> -> [4, 7, 11, 19, 27, 31, 47, 75, 87, 103]
ASM<3, 2> -> [5, 8, 13, 19, 23, 29, 43, 63, 68, 83, 99, 103]
ASM<3, 3> -> [6, 9, 15, 21, 33, 39, 51, 57, 69, 87, 93]
ASM<3, 4> -> [7, 10, 13, 17, 24, 33, 38, 45, 55, 59, 75, 83, 88, 94]
ASM<3, 5> -> [8, 11, 14, 19, 27, 31, 36, 47, 51, 60, 69, 75, 87, 91, 107]
ASM<3, 6> -> [9, 12, 15, 21, 33, 39, 51, 57, 69, 87, 93]
ASM<3, 7> -> [10, 13, 16, 19, 23, 29, 35, 43, 55, 63, 68, 73, 83, 99, 103, 108]
ASM<3, 8> -> [11, 14, 17, 20, 25, 31, 37, 47, 54, 59, 65, 73, 83, 91, 97, 105]
ASM<3, 9> -> [12, 15, 18, 21, 27, 33, 39, 51, 57, 69, 87, 93, 111]
ASM<4, 1> -> [5, 9, 14, 24, 34, 79, 89, 94]
ASM<4, 2> -> [6, 10, 16, 28, 46, 76, 88]
ASM<4, 3> -> [7, 11, 18, 26, 32, 40, 48, 60, 76, 95, 103]
ASM<4, 4> -> [8, 12, 20, 28, 44, 52, 68, 76, 92]
ASM<4, 5> -> [9, 13, 17, 22, 31, 43, 49, 58, 76, 97]
ASM<4, 6> -> [10, 14, 18, 24, 34, 46, 64, 76, 88, 106]
ASM<4, 7> -> [11, 15, 19, 26, 37, 42, 49, 64, 70, 82, 94, 103, 109]
ASM<4, 8> -> [12, 16, 20, 28, 44, 52, 68, 76, 92]
ASM<4, 9> -> [13, 17, 21, 25, 30, 38, 46, 56, 72, 82, 89, 96, 109]
ASM<5, 1> -> [6, 11, 17, 29, 41, 65, 95]
ASM<5, 2> -> [7, 12, 19, 33, 47, 54, 82, 89, 104]
ASM<5, 3> -> [8, 13, 21, 31, 37, 47, 61, 70, 101]
ASM<5, 4> -> [9, 14, 23, 33, 41, 51, 61, 77, 89, 97, 107]
ASM<5, 5> -> [10, 15, 25, 35, 55, 65, 85, 95]
ASM<5, 6> -> [11, 16, 21, 27, 38, 53, 60, 71, 93, 104]
ASM<5, 7> -> [12, 17, 22, 29, 41, 56, 65, 77, 93, 101, 107]
ASM<5, 8> -> [13, 18, 23, 31, 44, 51, 59, 77, 83, 98]
ASM<5, 9> -> [14, 19, 24, 33, 47, 53, 62, 81, 89, 104, 111]
ASM<6, 1> -> [7, 13, 20, 34, 48, 76, 90]
ASM<6, 2> -> [8, 14, 22, 38, 54, 62, 94]
ASM<6, 3> -> [9, 15, 24, 42, 69]
ASM<6, 4> -> [10, 16, 26, 38, 46, 58, 86]
ASM<6, 5> -> [11, 17, 28, 40, 50, 62, 74, 94, 108]
ASM<6, 6> -> [12, 18, 30, 42, 66, 78, 102]
ASM<6, 7> -> [13, 19, 25, 32, 45, 63, 71, 84, 110]
ASM<6, 8> -> [14, 20, 26, 34, 48, 66, 76, 90, 110]
ASM<6, 9> -> [15, 21, 27, 36, 51, 69, 96, 114]
ASM<7, 1> -> [8, 15, 23, 39, 55, 87, 103]
ASM<7, 2> -> [9, 16, 25, 43, 61, 71, 107]
ASM<7, 3> -> [10, 17, 27, 47, 67, 77]
ASM<7, 4> -> [11, 18, 29, 43, 51, 65, 84, 97]
ASM<7, 5> -> [12, 19, 31, 45, 55, 69, 83, 103]
ASM<7, 6> -> [13, 20, 33, 47, 59, 73, 87, 111]
ASM<7, 7> -> [14, 21, 35, 49, 77, 91]
ASM<7, 8> -> [15, 22, 29, 37, 52, 73, 82, 97]
ASM<7, 9> -> [16, 23, 30, 39, 55, 76, 87, 103]
ASM<8, 1> -> [9, 17, 26, 44, 62, 98]
ASM<8, 2> -> [10, 18, 28, 48, 68]
ASM<8, 3> -> [11, 19, 30, 52, 74, 85]
ASM<8, 4> -> [12, 20, 32, 56, 92]
ASM<8, 5> -> [13, 21, 34, 50, 60, 76, 99]
ASM<8, 6> -> [14, 22, 36, 52, 64, 80, 96]
ASM<8, 7> -> [15, 23, 38, 54, 68, 84, 100]
ASM<8, 8> -> [16, 24, 40, 56, 88, 104]
ASM<8, 9> -> [17, 25, 33, 42, 59, 83, 93, 110]
ASM<9, 1> -> [10, 19, 29, 49, 69, 109]
ASM<9, 2> -> [11, 20, 31, 53, 75]
ASM<9, 3> -> [12, 21, 33, 57, 81, 93]
ASM<9, 4> -> [13, 22, 35, 61, 87, 100]
ASM<9, 5> -> [14, 23, 37, 55, 65, 83, 107]
ASM<9, 6> -> [15, 24, 39, 57, 69, 87]
ASM<9, 7> -> [16, 25, 41, 59, 73, 91, 109]
ASM<9, 8> -> [17, 26, 43, 61, 77, 95, 113]
ASM<9, 9> -> [18, 27, 45, 63, 99, 117]
```


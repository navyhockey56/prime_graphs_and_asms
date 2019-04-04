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
(When the algorith is run using the fully-connected representation)  

Each iteration, `i`, the algorithm will need to:  
1. Move each existing cycle.  
2. Check if any existing cycle is on the center.
3. Add the new node.
Step `1` will always require `p(i)` operations, and step `2` will require at most `p(i)` operations. Thus, between steps `1` and `2` we will perform at most `2p(i)` operations. Step `3` has a constant number of iterations, `c`.

Thus, to run the algorithm for the first `n` iterations, the number of operations, `o(n)`, is given by:
`o(n) = Sum[i=1, n]{ 2p(i) + c } = 2*Sum[i=1, n]{ p(i) } + n*c <= 2*Sum[i=1, n]{ i } + n+c = n*(n+1) + n*c = n^2 + n*(c + 1)`.  

Furthermore, the number of nodes within the fully-connected graph on for any iteration, `i`, is `i` itself. Thus, the size of the fully-connected graph grows linearly!



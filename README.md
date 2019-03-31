# Prime Graphs
This project uses a state machine to determine the prime numbers. There is no addition, multiplication, or any other standard integer arithmetic needed to operate the state machine.

### How it works
We are going to iteratively build a directed graph called the Prime-Graph. The Prime-Graph is composed of cycles of various lengths all sharing a single point in common, the common point will be referred to as the center.

The Prime-Graph is self-building. We start with the center and then using the state-machine currently defined by the Prime-Graph, we add more points to the graph. It it difficult to quantify the Prime-Graph without knowing everything about it; as such, please bear with me as I list off the relevant information:

- For each cycle in the graph, one of the points within the cycle is 'on' and all other points are 'off'. At the next iteration, the 'on'  point will be switched to 'off' and it's adjacent point will be switched to 'on'.

- There exists an unfinished cycle at the start of each iteration. At the end of the iteration that cycle will either be connected to the center (thus completing the cycling) or another point will be added to the end of the unfinished cycle. The end of an unfinished cycle is always the 'on' point. If the unfinished cycle is connected to the center, then a new unfinished cycle will be created of the same length and then the new point will be added to that cycle. Thus, every iteration adds a new point to the graph.

- The unfinished cycle should be completed at the end of the iteration if and only if the center is 'off' after all the other cycles have moved. In this event, the unfinished cycle is connected to the center, and then it moves, thus turning the center on. (Thus, the center is always 'on' at the end of every iteration).

### Relationship to primes
Each of the completed cycles produced by running the Prime-Graph reprents a unique prime number. The prime number a cycle represents is equal to the number of points within it (thus, the state machine produces cycles of prime length). Furthermore, the cycles are produced in consequetive order (2, 3, 5, 7, ...). 

#### Why is this?
Since all cycles start at the center in the 'on' position, and we move the 'on' position to the next adjacent for each cycle, all the cycles within the graph are 'in-sync' (the way we create each new unfinished cycle preserves the synchronization). This implies that for each cycle, the distance from the center to the 'on' point is equal to the `current_iteration` moded by the `cycle_length`. Therefor, if the next iteration results with the cycle of length 5's 'on' position being the center, then we know the current iteration is divisible by 5. Furthermore, if the next iteration results in none of the previously completed cycles 'on' position being the center, then this implies that the current iteration is not divisible by any of the previous cycle lengths. Thus, by connecting the currently unfinished cycle to the center, we are creating a new completed cycle that has the length of this undivisible size. Thus, this new length is relatively prime to all the previous lengths! Finally, since we started on iteration 1, the numbers we find are actually the primes!!!

### Technicality
I said there'd be no arithmetic needed for the Prime-Graph, and I'm technically right - the result of running the Prime-Graph algorithm is a list of completed graphs. As such, you don't know what the prime numbers are when the algorithm finishes; instead, you just have a list of graphs that represent the prime numbers. To get the actual prime numbers, you have to run the size method on each cycle, and the size method has to use addition in order to count the number of points.

### Running
To run the Prime-Graph algorithm, simply load the progam into a ruby seesion and call run_machine:
```ruby
load 'prime_graphs.rb'
graphs = PrimeGraph.run_machine 5000
primes = graphs.map(&:size)
puts "The first #{primes.count} are #{primes}"
```

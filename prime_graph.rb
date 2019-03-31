module PrimeGraph

  def PrimeGraph.reload
    load 'prime_graph.rb'
  end

  def PrimeGraph.run_machine(number_of_iterations)
    # Create the center
    initial_point = InitialPoint.new 
    # Holds the completed cycles
    graphs = []
    # Create the inital, unifinished cycle
    current_graph = Graph.new(initial_point: initial_point)
    while ((number_of_iterations -= 1) >= 0)
      puts "Iterations left: #{number_of_iterations}"
      
      # Move all the completed cycles forward 1
      graphs.each(&:move)
  
      if initial_point.active
        # At least one completed cycle is 'on' at the center
        # add a new point to the unfinished cycle 
        current_graph << Point.new
      else
        # No completled cycles are 'on' at the center, thus this is
        # a new cycle length. Complete the unfinished graph by connecting
        # it to the center, and move it's 'on' position to the center 
        current_graph.move
        # Add the graph to the completed cycles
        graphs << current_graph
        # Create the copy for the new unfinished cycle
        current_graph = Graph.new(graph: current_graph)
        # Add a new point to the unfinished cycle.
        current_graph << Point.new
      end
    end
    # Returns the completed cycles.
    graphs
  end


  class Graph
    attr_reader :current_point, :initial_point

    def initialize(initial_point: nil, graph: nil)
      if initial_point
        # Only for the first incomplete cycle
        @initial_point = initial_point
        # Need to store a reference to this graph for the initial point's :adtive method
        # to work correctly
        initial_point.add_next(self, nil)
        @current_point = initial_point
      else
        # Copy the center
        @initial_point = graph.initial_point

        # Add a reference for this graph within the center
        current = @initial_point.next(graph).dup
        @initial_point.add_next(self, current)
        
        # Copy the rest of the points
        @current_point = current
        while (next_point = @current_point.next) 
          self << next_point.dup
        end
      end

    end

    # Adds a new point to the cycle
    def <<(point)
      # Set the given point as the current's next.
      # Then update the current point to the given point.
      if @current_point.class == InitialPoint
        # Only used by the first incomplete cycle
        @current_point.add_next(self, point)
      else
        @current_point.next = point
      end
      @current_point = point
    end

    # Move the 'on' point to the next adjacent point
    def move
      # Set the current point to the current point's next point.
      if (@current_point.class == InitialPoint)
        @current_point = current_point.next(self)
      else
        @current_point = current_point.next
        # Binds if we were at the end of the cycle
        @current_point ||= @initial_point
      end
    end

    def inspect
      {
        current_point: current_point.inspect
      }
    end

    def to_s
      JSON.pretty_generate(self.inspect)
    end

    def size
      current = @initial_point.next(self)
      # center + initial_point.next = 2 points so far
      count = 2 
      # Count all the rest of the points
      while (next_point = current.next)
        count += 1
        current = next_point
      end
      count
    end
  end

  class Point
    attr_accessor :next

    def inspect
      {
        has_next: !self.next.nil?
      }
    end

    def dup
      point = Point.new
      point.next = @next if @next
      point 
    end

    def to_s
      JSON.pretty_generate(self.inspect)
    end
  end

  class InitialPoint < Point
    def initialize()
      super
      @all_next = {}
    end

    def next(graph)
      @all_next[graph]
    end 

    def add_next(graph, point)
      @all_next[graph] = point
    end

    def active
      # Active if any of the graphs are currently on the center.
      @all_next.keys.any? {|g| g.current_point.class == InitialPoint}
    end

    def inspect
      "Initial Point"
    end

  end

end
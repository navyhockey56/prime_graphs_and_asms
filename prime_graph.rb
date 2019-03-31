module PrimeGraph

  def PrimeGraph.reload
    load '/home/will/Code/ruby/prime_graph.rb'
  end

  def PrimeGraph.run_machine(number_of_iterations)
    initial_point = InitialPoint.new 
    initial_graph = Graph.new(initial_point: initial_point)
    graphs = [initial_graph]
    current_graph = Graph.new(graph: initial_graph)
    while ((number_of_iterations -= 1) > 0)
      graphs.each(&:move)
      if initial_point.active
        current_graph << Point.new
      else 
        graphs << current_graph
        current_graph = Graph.new(graph: current_graph)
      end
    end

    graphs
  end


  class Graph
    attr_reader :current_point, :initial_point

    def initialize(initial_point: nil, graph: nil)
      if initial_point
        @initial_point = initial_point
        new_point = Point.new
        new_point.active = true
        @initial_point.add_next(self, new_point)
        @current_point = new_point
      else
        @initial_point = graph.initial_point
        current = @initial_point.next(graph).dup
        @initial_point.add_next(self, current)
        
        @current_point = current
        while (next_point = current.next) 
          self << next_point.dup
        end
      end
    end

    def <<(point)
      if @current_point.class == InitialPoint
        raise "You cannot add a new point to the initial point in this manner."
      else
        @current_point.next = point
        @current_point = point
      end
    end

    def move
      @current_point.active = false
      @current_point = current_point.next || initial_point
      @current_point.active = true
    end

    def inspect
      {
        current_point: current_point.inspect
      }
    end
  end

  class Point
    attr_accessor :active, :next

    def inspect
      {
        active: self.active,
        has_next: !self.next.nil?
      }
    end
  end

  class InitialPoint < Point
    def initialize()
      @all_next = {}
      @active = false
    end

    def next(graph)
      @all_next[graph]
    end 

    def add_next(graph, point)
      @all_next[graph] = point
    end

  end

end
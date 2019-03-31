module PrimeGraph

  def PrimeGraph.reload
    load 'prime_graph.rb'
  end

  def PrimeGraph.run_machine(number_of_iterations)
    
    initial_point = InitialPoint.new 
    initial_graph = Graph.new(initial_point: initial_point)
    
    graphs = []
    current_graph = initial_graph
    i = 0
    while ((number_of_iterations -= 1) >= 0)
      puts "Iteration: #{i += 1}"
      graphs.each(&:move)
  
      if initial_point.active
         current_graph << Point.new
      else
        graphs << current_graph
        current_graph.move
        current_graph = Graph.new(graph: current_graph)
        current_graph << Point.new
      end
    end

    graphs
  end


  class Graph
    attr_reader :current_point, :initial_point

    def initialize(initial_point: nil, graph: nil)
      if initial_point
        @initial_point = initial_point
        initial_point.add_next(self, nil)
        @current_point = initial_point
      else
        @initial_point = graph.initial_point
        current = @initial_point.next(graph).dup
        @initial_point.add_next(self, current)
        
        @current_point = current
        while (next_point = @current_point.next) 
          self << next_point.dup
        end
      end

    end

    def <<(point)
      if @current_point.class == InitialPoint
        @current_point.add_next(self, point)
      else
        @current_point.next = point
      end
      @current_point = point
    end

    def move
      if (@current_point.class == InitialPoint)
        @current_point = current_point.next(self)
      else
        @current_point = current_point.next
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
      count = 2
      current = @initial_point.next(self)
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
      @all_next.keys.any? {|g| g.current_point.class == InitialPoint}
    end

    def inspect
      "Initial Point"
    end

  end

end
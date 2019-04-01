module PrimeGraph

  def PrimeGraph.reload
    load 'prime_graph.rb'
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

  class Cycle
    attr_reader :current_point, :initial_point, :is_complete

    def initialize(initial_point: nil, cycle: nil)
      raise "You need to pass the initial point or a cycle" unless (initial_point || cycle)
      if initial_point
        @initial_point = initial_point
        @current_point = @initial_point
      else
        @initial_point = cycle.initial_point.dup
        @current_point = @initial_point
        current = @initial_point
        while ((next_point = current.next) && next_point != cycle.initial_point)
          current = next_point.dup
          self << current
        end
      end
      @is_complete = false
    end

    def <<(point)
      raise "The cycle has already been closed" if @is_complete
      @current_point.next = point 
      @current_point = point
      self
    end

    def close_cycle
      self << @initial_point
      @is_complete = true
      self
    end

    def length
      return @length if @length
      
      current = @initial_point
      count = 1
      while ((next_point = current.next) && next_point != @initial_point)
        count += 1
        current = next_point
      end
      @length = count if @is_complete
      count
    end

    def at_starting_point?
      @current_point == @initial_point
    end

    def move(number_of_moves=1)
      (0...number_of_moves).each { @current_point = @current_point.next }
      self
    end

    def position
      position = 0
      current = @initial_point
      while (current != @current_point)
        position += 1
        current = current.next
      end
      position 
    end

    def ==(cycle)
      cycle && cycle.class == Cycle && (cycle.is_complete == @is_complete) && cycle.length == self.length
    end

    def inspect
      {
        length: self.length,
        position: self.position,
        is_complete: self.is_complete
      }
    end

  end

  class CycleGraph
    attr_reader :cycles

    def initialize(*cycles)
      @cycles = cycles.sort {|a,b| a.length <=> b.length } if cycles
      @cycles ||= []
    end

    def move(number_of_moves=1)
      (0...number_of_moves).each { @cycles.each(&:move) }
      self
    end

    def ==(cycle_graph)
      cycle_graph && cycle_graph.class == CycleGraph && (@cycles.map(&:size) - cycle_graph.cycles.map(&:size))
    end

    def position
      @cycles.map(&:position)
    end

    def inspect
      {
        position: self.position,
        cycles: self.cycles
      }
    end

    def fully_active?
      @cycles.all?(&:at_starting_point?)
    end

    def active?
      @cycles.count > 0 && @cycles.any?(&:at_starting_point?)
    end

  end

  class PrimeGraph < CycleGraph

    attr_reader :iteration

    def initialize
      @cycles = []
      @initial_point = Point.new
      @unfinished_cycle = Cycle.new(initial_point: @initial_point)
      @unfinished_cycle << Point.new
      @iteration = 1
    end

    def run_machine(number_of_iterations)
      @iteration += number_of_iterations
      while (number_of_iterations -= 1) >= 0
        puts "Iterations left: #{number_of_iterations}"
        self.move
        unless self.active? 
          @unfinished_cycle.close_cycle
          @cycles << @unfinished_cycle
          @unfinished_cycle = Cycle.new(cycle: @unfinished_cycle)
        end
        @unfinished_cycle << Point.new
      end
      self
    end

    def inspect
      {
        iteration: self.iteration,
        primes: self.primes,
        position: self.position
      }
    end

    def primes 
      @cycles.map(&:length)
    end

  end

end
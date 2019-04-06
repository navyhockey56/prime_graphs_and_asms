module AwkwardMath

	def AwkwardMath.reload
		load 'awkward.rb'
	end

	class Point
		attr_reader :next_point

		def <<(vertex)
			set_next(vertex)
		end

		def set_next(vertex)
			@next_point = vertex
		end

		def inspect
			"Point: has next? #{!@next_point.nil?}"
		end

		def next
			@next_point
		end

	end

	class ActivePoint < Point 
		def inspect
			"ActivePoint: has next? #{!@next_point.nil?}"
		end
	end

	class Branch

		attr_reader :starting_point, :current_point

		def initialize(starting_point, current_point=nil)
			@starting_point = starting_point
			@current_point = current_point || starting_point
		end

		def <<(point)
			@current_point << point 
			@current_point = point
		end

		def dup
			starting_point = @starting_point.dup
			current = starting_point
			while ((next_point = current.next.dup) != nil)
				current << next_point
				current = next_point
			end
			Branch.new(starting_point, current)
		end

		def copy_and_close
			copy = self.dup
			copy << copy.starting_point
			Cycle.new(copy.current_point)
		end

		def length
			count = 1
			current = @starting_point
			while (current = current.next)
				count += 1
			end
			count
		end

	end

	class Cycle

		attr_reader :current_point

		def initialize(current_point)
			@starting_point = current_point
			@current_point = current_point
		end

		def active?
			@current_point.class == ActivePoint
		end

		def move
			@current_point = @current_point.next
		end

		def length
			count = 1
			current = @starting_point
			while (current = current.next) != @starting_point
				count += 1
			end
			count
		end

	end

	class StateMachine
		
		def next_state
			raise "Abstract method error"
		end

		def run_machine(iterations)
			iterations.times do 
				self.next_state
			end
			self
		end

	end

	class AwkwardStateMachine < StateMachine
		attr_reader :cycles, :branch

		# 
		# @param [int] intial_branch_length - The length of the initial
		# branch when disconnected from the activators
		def initialize(number_of_activators, initial_branch_length)
			
			activator = ActivePoint.new
			starting_point = activator
			(number_of_activators - 1).times do 
				next_activator = ActivePoint.new
				activator << next_activator
				activator = next_activator
			end

			current = activator
			initial_branch_length.times do 
				next_point = Point.new
				current << next_point
				current = next_point
			end

			@branch = Branch.new(starting_point, current)
			@cycles = []
		end

		def next_state
			# Advance the current cycles
			@cycles.each(&:move)
			unless self.active?
      	@cycles << @branch.copy_and_close 
      end
      @branch << Point.new
      self
		end

		def active?
			@cycles.any?(&:active?)
		end

		def lengths
			@cycles.map(&:length)
		end

	end

end
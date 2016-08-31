# frozen_string_literal: true
class DayPart
  include Mongoid::Document
  include Mongoid::Timestamps

  field :name, type: String
end

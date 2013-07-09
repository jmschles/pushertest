class MessagesController < ApplicationController

  before_filter :authenticate_user!

  require 'pusher'

  Pusher.app_id = '49030'
  Pusher.key = '942f40662c8b1236e58b'
  Pusher.secret = '7f12a2427ce3be7e66cb'

  def create
    @message = current_user.messages.build(params[:message])
    Pusher['presence-channel'].trigger('my-event', {:message => @message.content, :name => current_user.email})
    @message.save!
    render :json => @message
  end

  def index
    @messages = Message.all
  end

end

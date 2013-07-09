Pushertest::Application.routes.draw do
  devise_for :users

  root :to => "messages#index"

  resources :messages, :only => [:create]
  post 'pusher/auth', :to => "pusher#auth"
end
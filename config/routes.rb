Pushertest::Application.routes.draw do
  devise_for :users

  root :to => "messages#index"

  resources :messages, :only => [:create]
  post 'pusher/auth', :to => "pusher#auth"

  get 'game/playsnake', :to => "game#play_snake"
  get 'game/playasteroids', :to => "game#play_asteroids"
end
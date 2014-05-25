require([
  '$api/models',
  '$api/facebook',
  '$api/library',
  '$views/list#List'
], function(models, facebook, library, List) {
  'use strict';


  var doPlaylistForAlbum = function() {

    // playlist test

    var tracks = {
      identifier: {},
      set: []
    };

    library.Library
    .forCurrentUser()
    .playlists.snapshot()
    .done(function(playlistMeta) {
      var urls = playlistMeta._uris;
      console.log(urls.length);

      for(var i = 0; i < urls.length; i++ ) {
        if(!urls[i]) { return; } 

        var playlist = models.Playlist.fromURI(urls[i]);
        playlist.load('tracks', 'name').done(function(a) {
          console.log(a);
        });
      }
    });

    // window.setTimeout(function() {
    //   console.log(window.ctracks);
    // }, 1000);

    // facebook test
    var session = new facebook.FacebookSession();

    session.friends.snapshot().done(function( data ) {
      var friends = data._uris;
      for ( var i = 0; i < friends.length; i++ ) {
        var tracks = {
          identifier: {},
          set: []
        };

        var friend = friends[i];

        facebook.FacebookUser.fromId(friend).load('id', 'user', 'image', 'name').done(function(data) {
          if(data.user) { 
            //  console.log(data.user);
          }
        });
      }
    });





    var album = models.Album.fromURI('spotify:album:5rCCCernTo6IwFwEZM4H53');
    var list = List.forAlbum(album);
    document.getElementById('playlistContainer').appendChild(list.node);
    list.init();
  };

  exports.doPlaylistForAlbum = doPlaylistForAlbum;
});

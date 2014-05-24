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
      for (var i = 0; i < urls.length; i++) {
        if(urls[i]) {
          var playlist = models.Playlist.fromURI(urls[i]);

          if(!playlist.tracks) return; 
          playlist.tracks.snapshot().done(function(playlists) {
            var pURIs = playlists._uris;

            for (var i = 0; i < pURIs.length; i++) {
              var trackURI = pURIs[i];
              if(!tracks.identifier[trackURI]) {
                tracks.identifier[trackURI] = true;
                tracks.set.push(trackURI);
              }
            }
          });
        }
      }
    });

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
        var test = facebook.FacebookUser;
          console.log(facebook.FacebookUser._requestMetadata());
      }
    });





    var album = models.Album.fromURI('spotify:album:5rCCCernTo6IwFwEZM4H53');
    var list = List.forAlbum(album);
    document.getElementById('playlistContainer').appendChild(list.node);
    list.init();
  };

  exports.doPlaylistForAlbum = doPlaylistForAlbum;
});

/*
 Implemented by katowulf at:
 https://jsfiddle.net/katowulf/1dfyz2rq/

 Discussed in:
 https://github.com/firebase/angularfire/issues/687
 https://github.com/angular-ui/ui-sortable/issues/421
 */
angular.module('firebase.checkpointArray', ['firebase'])
  .factory('firebaseCheckpointArray', function($firebaseArray) {
    return $firebaseArray.$extend({
      checkpoint: function() {
        this._checkpointIds = this._buildIds();
      },

      saveChanges: function() {
        if (!this._checkpointIds) {
          throw new Error('No checkpoint declared. Can\'t save yet. You may need to wait until $loaded() completes.');
        }
        var oldIds = this._checkpointIds;
        var currentIds = this._buildIds();
        var recs = this.$list;
        var ref = this.$ref();
        
        this._checkpointIds = null;
        
        //console.log('oldIds', oldIds);
        //console.log('currentIds', currentIds);
        
        // look for removed records
        angular.forEach(oldIds, function(pos, key) {
          if (!currentIds.hasOwnProperty(key)) {
            //console.log('removed', key);
            ref.child(key).remove();
            delete this._indexCache[key];
          }
        }, this);
        
        // look for moved or added records
        angular.forEach(currentIds, function(pos, key) {
          var rec = this.$list[pos];
          if (pos !== oldIds[key] || pos !== rec.$priority) {
            //console.log('saving', rec.$id, oldIds[key], pos, rec.$priority);
            rec.$priority = pos;
            this._indexCache[key] = pos;
            this.$save(rec);
          }
        }, this);
      },

      _buildIds: function() {
        var ids = {};
        var ref = this.$ref();
        angular.forEach(this.$list, function(rec, i) {
          // to simplify prioritizing and moving things around
          // assign all records an id right away, even if they
          // have not been saved to the server before
          // they will be added when calling saveChanges()
          if (!rec.$id) {
            rec.$id = ref.push().key();
          }
          ids[rec.$id] = i;
        });
        return ids;
      }
    });
  });
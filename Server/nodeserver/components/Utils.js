
/* Generic function to set tag to some entity
    * Parameters: 
    *  entity - string - Type of Entity(ex: User)
    *  entityquery - object - query for entity(ex: { user_id: guid})
    *  relationship - string - ex: Relationship_Tag_User
    *  newEntity - object - Type of Entity(ex: Tag)
    *  newEntityquery - object - query for new entity(ex: { name: string})
    *  callback - callback method to be executed 
    * */
exports.getMergeAndRelationshipQuery = function (entity, entityquery, relationship, newEntity, newEntityquery, callback) {

    return "MATCH (n:" + entity + " " + this.cleanQuery(entityquery) + ") " +
                    "MERGE (newEntity:" + newEntity + " " + this.cleanQuery(newEntityquery) + ") " +
                    "MERGE (n)-[r:" + relationship + "]->(newEntity) " +
                    "RETURN newEntity";
}

    
exports.cleanQuery = function (query) {
    var txt = "{ ";
    for (var key in query) {
        txt += (key + ":" + "\"" + query[key] + "\",");
    }
    txt = txt.slice(0, -1);
    txt += " }"

    return txt;


}
    
    
exports.isError = function (err, res, errorMessage) {
    if (err) {
        console.error(errorMessage + ': ' + err.message);
        res.json({ IsSuccess: false });
        return true;
    }
    return false;
}
    
exports.guid = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
}
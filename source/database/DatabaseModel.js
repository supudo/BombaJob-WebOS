enyo.application.persistence = persistence;
persistence.store.websql.config(persistence, 'bombajob.webos', "BombaJob for webOS", 65536);
enyo.application.models = {};

var TextContent = enyo.application.models.TextContent = persistence.define('TextContent', {
    cid: 'INT',
    title: 'TEXT',
    content: 'TEXT'
});

// TextContent.index(['cid', 'id'], {unique: true});

var Category = enyo.application.models.Category = persistence.define('Category', {
    cid: 'INT',
    title: 'TEXT',
    offercount: 'INT'
});

// Category.index(['cid', 'id'], {unique: true});

var JobOffer = enyo.application.models.JobOffer = persistence.define('JobOffer', {
    oid: 'INT',
    cid: 'INT',
    title: 'TEXT',
    categorytitle: 'TEXT',
    email: 'TEXT',
    freelanceyn: 'BOOLEAN',
    humanyn: 'BOOLEAN',
    negativism: 'TEXT',
    positivism: 'TEXT',
    publishdate: 'DATE',
    publishdatestring: 'TEXT',
    publishdatestamp: 'TEXT',
    readyn: 'BOOLEAN',
    sentmessageyn: 'BOOLEAN'
});

//Category.hasMany('jobOffers', JobOffer, 'category');
// JobOffer.index(['oid', 'id'], {unique: true});

persistence.schemaSync();

persistence.debug = false;
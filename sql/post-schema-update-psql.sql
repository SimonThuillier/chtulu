DROP SEQUENCE hb_date_type_id_seq;
     CREATE SEQUENCE hb_date_type_id_seq;
     SELECT setval('hb_date_type_id_seq', (SELECT MAX(id) FROM hb_date_type));
     ALTER TABLE hb_date_type ALTER id SET DEFAULT nextval('hb_date_type_id_seq');

	 DROP SEQUENCE hb_resource_type_id_seq;
     CREATE SEQUENCE hb_resource_type_id_seq;
     SELECT setval('hb_resource_type_id_seq', (SELECT MAX(id) FROM hb_resource_type));
     ALTER TABLE hb_resource_type ALTER id SET DEFAULT nextval('hb_resource_type_id_seq');

	 DROP SEQUENCE hb_article_type_id_seq;
     CREATE SEQUENCE hb_article_type_id_seq;
     SELECT setval('hb_article_type_id_seq', (SELECT MAX(id) FROM hb_article_type));
     ALTER TABLE hb_article_type ALTER id SET DEFAULT nextval('hb_article_type_id_seq');

	 DROP SEQUENCE hb_resource_version_id_seq;
     CREATE SEQUENCE hb_resource_version_id_seq;
     SELECT setval('hb_resource_version_id_seq', (SELECT MAX(id) FROM hb_resource_version));
     ALTER TABLE hb_resource_version ALTER id SET DEFAULT nextval('hb_resource_version_id_seq');

	 DROP SEQUENCE hb_user_id_seq;
     CREATE SEQUENCE hb_user_id_seq;
     SELECT setval('hb_user_id_seq', (SELECT MAX(id) FROM hb_user));
     ALTER TABLE hb_user ALTER id SET DEFAULT nextval('hb_user_id_seq');

DROP SEQUENCE hb_resource_id_seq;
CREATE SEQUENCE hb_resource_id_seq;
     SELECT setval('hb_resource_id_seq', (SELECT MAX(id) FROM hb_resource));
     ALTER TABLE hb_resource ALTER id SET DEFAULT nextval('hb_resource_id_seq');

	 DROP SEQUENCE hb_article_id_seq;
     CREATE SEQUENCE hb_article_id_seq;
     SELECT setval('hb_article_id_seq', (SELECT MAX(id) FROM hb_article));
     ALTER TABLE hb_article ALTER id SET DEFAULT nextval('hb_article_id_seq');

	 DROP SEQUENCE hb_resource_file_id_seq;
     CREATE SEQUENCE hb_resource_file_id_seq;
     SELECT setval('hb_resource_file_id_seq', (SELECT MAX(id) FROM hb_resource_file));
     ALTER TABLE hb_resource_file ALTER id SET DEFAULT nextval('hb_resource_file_id_seq');

DROP SEQUENCE hb_resource_geometry_id_seq;
     CREATE SEQUENCE hb_resource_geometry_id_seq;
     SELECT setval('hb_resource_geometry_id_seq', (SELECT MAX(id) FROM hb_resource_geometry));
     ALTER TABLE hb_resource_geometry ALTER id SET DEFAULT nextval('hb_resource_geometry_id_seq');
     
DROP SEQUENCE hb_article_link_id_seq;
     CREATE SEQUENCE hb_article_link_id_seq;
     SELECT setval('hb_article_link_id_seq', (SELECT MAX(id) FROM hb_article_link));
     ALTER TABLE hb_article_link ALTER id SET DEFAULT nextval('hb_article_link_id_seq');     

set search_path TO 'public';
INSERT INTO hb_article_type VALUES (1,'Evenement'),(4,'Lieu'),(2,'Personnage'),(3,'Theme');
INSERT INTO hb_date_type VALUES (1,'Précise',NULL),(2,'Imprecise (bornée)',NULL),(3,'Mois',NULL),(4,'Saison',NULL),(5,'Année',NULL),(6,'Decennie',NULL),(7,'Siècle',NULL),(8,'Millénaire',NULL);
INSERT INTO hb_resource_type VALUES (1,'Image'),(2,'Texte');
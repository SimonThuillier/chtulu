update hb_article set first_rank_links_count=0,second_rank_links_count=0 WHERE true;

UPDATE hb_article
SET first_rank_links_count = t.count
FROM
  (select a.id,count(distinct l.child_article_id) as count from
    hb_article a left join hb_article_link l ON l.parent_article_id = a.id
  group by a.id having count(distinct l.child_article_id)>0) t
WHERE
  t.id = hb_article.id;

UPDATE hb_article
SET second_rank_links_count = t.count
FROM
  (select a.id,(sum(sa.first_rank_links_count+1)) as count
   from
     hb_article a
     left join hb_article_link l ON l.parent_article_id = a.id
     left join hb_article sa ON l.child_article_id = sa.id
   group by a.id having count(distinct l.child_article_id)>0) t
WHERE
  t.id = hb_article.id;
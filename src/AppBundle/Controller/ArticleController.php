<?php
namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use AppBundle\Entity\Article;
use AppBundle\Form\ArticleMainType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use AppBundle\DTO\ArticleMainDTO;
use Symfony\Component\Form\FormBuilderInterface;
use AppBundle\DTO\ArticleCollectionDTO;
use AppBundle\Factory\ArticleDTOFactory;
use AppBundle\Form\ArticleModalType;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\SerializerInterface;
use AppBundle\Helper\ArticleHelper;

/**
 *
 * @author belze
 *         @Route("/article")
 */
class ArticleController extends Controller
{

    /**
     * @Route("/create",name="article_create")
     * @Template()
     */
    public function createAction(Request $request, ArticleDTOFactory $articleDTOFactory,ArticleHelper $helper)
    {
        $article = new Article();
        /** @var ArticleMainDTO $articleDTO */
        $articleDTO = $articleDTOFactory->newInstance("main");
        $articleModalDTO = $articleDTOFactory->newInstance("modal");
        // $form = $this->createForm(ArticleType::class, $articleDTO);
        /** @var ArticleMainType $form */
        $form = $this->get('form.factory')
            ->createBuilder(ArticleMainType::class)
            ->setData($articleDTO)
            ->getForm();
        /** @var FormInterface $modaForm */
        $modalForm = $this->get('form.factory')
            ->createBuilder(ArticleModalType::class)
            ->setData($articleModalDTO)
            ->getForm();
        
        // ->add('save', SubmitType::class, array('label' => 'Creer article'));
        
        $form->handleRequest($request);
        
        if ($form->isSubmitted()) {
            if ($form->isValid()) {
                $articleDTO = $form->getData();
                $test = $helper->deserializeSubEvents($articleDTO->subEvents);
                /** @var ArticleCollectionDTO $articleCollectionDTO */
                // $articleCollectionDTO = $serializer->deserialize($articleDTO->getSubEvents(), null, 'json');
                
                
                
                return $this->render('::debug.html.twig', array(
                    'debug' => array(
                        "title" => $articleDTO->title,
                        "test" => $test
                    )
                ));
            } else {
                
                return $this->render('::debug.html.twig', array(
                    'debug' => array(
                        'formErrors' => json_encode($form->getErrors(true, false)),
                        'form_submitted' => json_encode($form->isSubmitted()),
                        'form_valid' => json_encode($form->isValid())
                    )
                ));
            }
        }
        
        return array(
            'form' => $form->createView(),
            'modalForm' => $modalForm->createView()
        );
    }

    /**
     * @Route("/edit/{id}")
     * @Template()
     */
    public function editAction(Request $request, $id)
    {
        $article = $this->getDoctrine()
            ->getRepository('EntityBundle:Article')
            ->find($id);
        $form = $this->createForm(ArticleMainType::class, $article)->add('save', SubmitType::class, array(
            'label' => 'Editer article'
        ));
        
        $form->handleRequest($request);
        
        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->flush();
        }
        return array(
            'form_article' => $form->createView()
        );
    }
}

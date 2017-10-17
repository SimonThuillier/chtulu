<?php
namespace AppBundle\Helper;


class StaticHelper
{

    /**
     * genrically map at runtime an array to corresponding object properties
     * 
     * @param array $array
     * @param mixed $object
     */
    static function mapArrayToObject($array, $object)
    {
        foreach ($array as $key => $value) {
                $object->$key = $value;
        }
    }
    
    /**
     * Once the articleDTO is completed, performs various tasks to make it available for future use
     * Notably updates dates precision and presence */
    static function finalizeArticleDTO($dto){
        $dto->isBeginDateApprox = true;
        $dto->beginDate = null;
        if($dto->minBeginDate !== null && $dto->maxBeginDate === null){
            $dto->isBeginDateApprox = false;
            $dto->beginDate = $dto->minBeginDate;
            $dto->minBeginDate = null;
            $dto->maxBeginDate = null;
        }
        $dto->hasNotEndDate = true;
        $dto->isEndDateApprox = false;
        $dto->endDate = null;
        if($dto->minEndDate === null && $dto->maxEndDate !== null){
            $dto->hasNotEndDate = false;
            $dto->endDate = $dto->maxEndDate;
            $dto->minEndDate = null;
            $dto->maxEndDate = null;
        }
        else if($dto->minEndDate !== null && $dto->maxEndDate !== null){
            $dto->hasNotEndDate = false;
            $dto->isEndDateApprox = true;
        }
    }
    
    static function getDateOptions($label)
    {
        return array(
            'label' => $label,
            'widget' => 'single_text',
            'html5' => false,
            'format' => 'dd/MM/r',
            'attr' => [
                'class' => 'hts-date-input',
                'pattern' => "^(0?[1-9]|[1-2][0-9]|3[0-1])/(0?[1-9]|1[0-2])/(-?[1-9][0-9]*)$",
                'placeholder' => "JJ/MM/AAAA"
            ]
        );
    }
}
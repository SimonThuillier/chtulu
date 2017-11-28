<?php
namespace AppBundle\Mapper;

class HDateMapper extends AbstractSimpleMapper
{
    
    /**
     * @param mixed $inputObject
     * @param mixed $outputObject
     * @param string $inputPrefix
     * @param string $inputSuffix
     */
    static function map($inputObject,$outputObject,$inputPrefix='',$outputPrefix='')
    {
       /* $setter = 'set' . $prefix . 'BeginDate';
        
        $outputObject->($prexi . 'beginDate') = $inputObject->beginDate;
        
        */
        self::affect($inputObject, $outputObject, $inputPrefix . 'beginDate', $outputPrefix . 'beginDate');
    }
    
    /**
     * @param mixed $inputObject
     * @param mixed $outputObject
     * @param string|null $prefix
     */
    static function iMap($inputObject,$outputObject,$prefix='')
    {
        /* $setter = 'set' . $prefix . 'BeginDate';
        
        $outputObject->($prexi . 'beginDate') = $inputObject->beginDate;
        
        */
    }
}
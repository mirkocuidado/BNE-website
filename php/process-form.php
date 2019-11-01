<?php
require 'vendor/autoload.php';

class Validator extends \SimpleValidator\Validator{
    protected static function alpha($input) {
        if($input == NULL)
            return true;
        return (preg_match("/^[\p{L} ]+$/u", $input) == 1);
    }
    protected static function phone($input) {
        if($input == NULL)
            return true;
        return (preg_match("/^06[0-9 ]*$/", $input) == 1);
    }
    protected static function file($file){
        if($file['error'] !== UPLOAD_ERR_OK)
            return false;
        $finfo = new finfo( FILEINFO_MIME);
        $mime = $finfo->file($file['tmp_name']);
        if(strpos($mime,'application/pdf') === false)
            return false;
        return true;
    }
}

// max upload file size should be defined in php.ini so it all works natively without tinkering

$rules = [
    'competition' => [
        'required',
        'alpha_numeric',
        'max_length(10)'
    ],
    'name' => [
        'required',
        'alpha',
        'max_length(63)'
    ],
    'email' => [
        'required',
        'email',
        'max_length(63)'
    ],
    'phone' => [
        'required',
        'phone',
        'max_length(15)'
    ],
    'team' => [
        'alpha',
        'max_length(63)'
    ],
    'university' => [
        'required',
        'alpha',
        'max_length(63)'
    ],
    'module' => [
        'required',
        'alpha',
        'max_length(63)'
    ],
    'year' => [
        'required',
        'integer'
    ],
    'shirt-size' => [ //Good enough
        'required',
        'alpha',
        'max_length(4)'
    ],
    'cv' => [
        'file'
    ],
    'cover-letter' => [
        'required',
        'max_length(4095)'
    ],
    'comments' => [
        'max_length(1023)'
    ]
];

$_POST['cv']=$_FILES['cv']; //so we can deal with input easier

//ABB doesn't want cv, only cover letters, while others want cv
unset($rules[$_POST['competition'] === 'abb' ? 'cv' : 'cover-letter']);

//trim potential additional params
$input=[];
foreach ($rules as $key => $value)
    $input[$key] = $_POST[$key];

//validate form fields
$validation_result = Validator::validate($input, $rules);
$validation_result->customErrors([
    'file' => 'Problem sa upload-om fajla. Samo pdf fajlovi manji od 16MB su dozvoljeni.',
    'phone' => 'Telefonski broj nije dobro formatiran. Primer: 065 3859389'
]);
if ($validation_result->isSuccess() == false) {
    http_response_code(400);
    die('<pre>' . var_export($validation_result->getErrors("sr"), true) . '</pre>');
}

//assign file variables based on sanitized form input
$basename   = $input['competition'].'-'.$input['team'].'-'.$input['name'];
$extension  = ($_POST['competition'] === 'abb' ? '.txt' : '.pdf');
$fullname   = $basename.$extension;
$cv_folder  = 'data/cvs';
$path       = $cv_folder.'/'.$fullname;

//make sure cv dir exists and file is not already there
if(!is_dir($cv_folder))
    mkdir($cv_folder,0777,true);
if(file_exists($path)){
    http_response_code(400);
    die("Greška prilikom čuvanja cv-a/pisma. Verovatno ste već jednom prosledili formu. Kontaktirajte administratora na it@brandnewengineers.rs kako bi poništili prethodnu prijavu.");
}

//cv stuff, only for not abb
if($_POST['competition'] !== 'abb'){
    if(!move_uploaded_file($input['cv']['tmp_name'],$path)){
        http_response_code(400);
        die("Greska prilikom čuvanja cv-a. Kontaktirajte administratora na it@brandnewengineers.rs");
    }
    $input['cv'] = $fullname;
}else{
    file_put_contents($path,$input['cover-letter'],FILE_TEXT);
    $input['cover-letter'] = $fullname;
}

//append to csv
$csv = fopen('data/data.csv', 'a');
fputcsv($csv,$input);
fclose($csv);

//send mail notification when new admission arrives
$to      = 'it@brandnewengineers.rs';
$subject = 'Prijava: '.$input['team'].'-'.$input['name'];
$message = var_export($input,true);
$headers = 'From: prijave@brandnewengineers.rs' . "\r\n" .
    'Reply-To: it@brandnewengineers.rs' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();
mail($to, $subject, $message, $headers);

//announce to user that all went well, and redirect him back
http_response_code(200);
header( "refresh:3;url=https://brandnewengineers.rs/" );
echo "Forma je uspešno prosleđena. Uskoro ćete biti vraćeni na početnu stranicu.<script>setTimeout(function(){window.location.replace('https://brandnewengineers.rs/');},4000);</script>";
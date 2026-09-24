<?php
namespace App\Services;

class ColorTester {
    private string $name;
    private const MAX_COLORS = 255;

    public function __construct(string $name = 'DefaultTester') {
        $this->name = $name;
    }

    /**
     * @param array<string> $colors
     * @return array<int, string>
     */
    public function processColors(array $colors): array {
        $processed = [];

        // This will cause a warning - undefined variable
        echo $undefinedVariable;

        foreach ($colors as $index => $color) {
            if ($color === '#FF0000') {
                $processed[] = "RED-$index";
            } elseif ($color === '#00FF00') {
                $processed[] = "GREEN-$index";
            }
        }

        // This will cause an error - calling undefined method
        $this->nonExistentMethod();

        $htmlSpecial = htmlspecialchars("<div>Test</div>");

        // Testing different types
        $number = 42;
        $float = 3.14;
        $string = "Hello {$this->name}!";
        $boolean = true;
        $null = null;
        $array = ['red' => '#FF0000', 'green' => '#00FF00'];

        return $processed;
    }
}

// Testing heredoc
$sql = <<<SQL
    SELECT *
    FROM colors
    WHERE brightness > 50
    AND saturation < :sat
SQL;

// Instantiate and use
$tester = new ColorTester();
$result = $tester->processColors(['#FF0000', '#00FF00']);

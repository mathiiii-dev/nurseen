<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220531120203 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE kid ADD color VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE link_code DROP INDEX IDX_C652A2317373BFAA, ADD UNIQUE INDEX UNIQ_C652A2317373BFAA (nurse_id)');
        $this->addSql('ALTER TABLE link_code DROP expiration, CHANGE nurse_id nurse_id INT DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE refresh_tokens (id INT AUTO_INCREMENT NOT NULL, refresh_token VARCHAR(128) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, username VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, valid DATETIME NOT NULL, UNIQUE INDEX UNIQ_9BACE7E1C74F2195 (refresh_token), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE kid DROP color');
        $this->addSql('ALTER TABLE link_code DROP INDEX UNIQ_C652A2317373BFAA, ADD INDEX IDX_C652A2317373BFAA (nurse_id)');
        $this->addSql('ALTER TABLE link_code ADD expiration DATETIME NOT NULL, CHANGE nurse_id nurse_id INT NOT NULL');
    }
}

<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220509154447 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE feed (id INT AUTO_INCREMENT NOT NULL, nurse_id INT DEFAULT NULL, text LONGTEXT NOT NULL, creation_date DATE NOT NULL, INDEX IDX_234044AB7373BFAA (nurse_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE feed_image (id INT AUTO_INCREMENT NOT NULL, feed_id INT DEFAULT NULL, url VARCHAR(255) NOT NULL, INDEX IDX_30B257E351A5BC03 (feed_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE feed ADD CONSTRAINT FK_234044AB7373BFAA FOREIGN KEY (nurse_id) REFERENCES nurse (id)');
        $this->addSql('ALTER TABLE feed_image ADD CONSTRAINT FK_30B257E351A5BC03 FOREIGN KEY (feed_id) REFERENCES feed (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE feed_image DROP FOREIGN KEY FK_30B257E351A5BC03');
        $this->addSql('DROP TABLE feed');
        $this->addSql('DROP TABLE feed_image');
    }
}

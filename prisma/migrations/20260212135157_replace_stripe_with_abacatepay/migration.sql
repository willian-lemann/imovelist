-- CreateTable
CREATE TABLE "add_listing_indices" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "add_listing_indices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adonis_schema" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "batch" INTEGER NOT NULL,
    "migration_time" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adonis_schema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adonis_schema_versions" (
    "version" INTEGER NOT NULL,

    CONSTRAINT "adonis_schema_versions_pkey" PRIMARY KEY ("version")
);

-- CreateTable
CREATE TABLE "galleries" (
    "id" SERIAL NOT NULL,
    "listing_id" INTEGER,
    "url" VARCHAR(255) NOT NULL,
    "filename" VARCHAR(255) NOT NULL,
    "mime_type" VARCHAR(255),
    "size" INTEGER,
    "order" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "galleries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listings" (
    "id" SERIAL NOT NULL,
    "agent_id" INTEGER,
    "name" VARCHAR(255),
    "link" VARCHAR(255),
    "image" VARCHAR(255),
    "address" VARCHAR(255),
    "price" VARCHAR(255),
    "area" INTEGER,
    "bedrooms" INTEGER,
    "type" VARCHAR(255),
    "for_sale" BOOLEAN,
    "parking" INTEGER,
    "content" TEXT,
    "photos" JSONB DEFAULT '[]',
    "agency" VARCHAR(255),
    "bathrooms" INTEGER,
    "ref" VARCHAR(255),
    "placeholder_image" VARCHAR(255),
    "published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "policies" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scrapped_infos" (
    "id" SERIAL NOT NULL,
    "total_pages" INTEGER,
    "total_listings" INTEGER,
    "agency" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "scrapped_infos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scrapped_listings" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "link" VARCHAR(255),
    "image" VARCHAR(255),
    "address" VARCHAR(255),
    "price" DECIMAL(12,2),
    "area" VARCHAR(255),
    "bedrooms" INTEGER,
    "type" VARCHAR(255),
    "for_sale" BOOLEAN,
    "parking" INTEGER,
    "content" TEXT,
    "photos" JSON,
    "agency" VARCHAR(255),
    "bathrooms" INTEGER,
    "ref" VARCHAR(255),
    "placeholder_image" VARCHAR(255),
    "agent_id" VARCHAR(255),
    "published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scrapped_listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "abacatepay_customer_id" VARCHAR(255) NOT NULL,
    "abacatepay_billing_id" VARCHAR(255) NOT NULL,
    "plan" VARCHAR(255) NOT NULL DEFAULT 'free',
    "status" TEXT DEFAULT 'pending',
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "full_name" VARCHAR(255),
    "email" VARCHAR(254) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6),
    "profile_photo" VARCHAR(255),
    "whatsapp" VARCHAR(255),
    "profile_url" VARCHAR(255),
    "logo" VARCHAR(255),
    "abacatepay_customer_id" VARCHAR(255),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "galleries_listing_id_order_index" ON "galleries"("listing_id", "order");

-- CreateIndex
CREATE INDEX "idx_listings_created_at" ON "listings"("created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_listings_for_sale" ON "listings"("for_sale");

-- CreateIndex
CREATE INDEX "idx_listings_price" ON "listings"("price");

-- CreateIndex
CREATE INDEX "idx_listings_ref" ON "listings"("ref");

-- CreateIndex
CREATE INDEX "idx_listings_type" ON "listings"("type");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_abacatepay_billing_id_unique" ON "subscriptions"("abacatepay_billing_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_unique" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_profile_url_unique" ON "users"("profile_url");

-- CreateIndex
CREATE UNIQUE INDEX "users_abacatepay_customer_id_unique" ON "users"("abacatepay_customer_id");

-- AddForeignKey
ALTER TABLE "galleries" ADD CONSTRAINT "galleries_listing_id_foreign" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_agent_id_foreign" FOREIGN KEY ("agent_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

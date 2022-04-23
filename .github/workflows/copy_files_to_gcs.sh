gsutil -h "Content-Type:text/html" -h "Cache-Control:no-store" cp src/index.html gs://${GCP_BUCKET}
gsutil -h "Content-Type:text/javascript" -h "Cache-Control:no-store" cp src/script.js gs://${GCP_BUCKET}
gsutil -h "Content-Type:text/javascript" -h "Cache-Control:no-store" cp src/notifications.js gs://${GCP_BUCKET}
gsutil -h "Content-Type:text/css" -h "Cache-Control:no-store" cp src/style.css gs://${GCP_BUCKET}
gsutil -h "Content-Type:text/css" -h "Cache-Control:no-store" cp src/examples.css gs://${GCP_BUCKET}
gsutil -h "Content-Type:text/css" -h "Cache-Control:no-store" cp src/notifications.css gs://${GCP_BUCKET}
gsutil -h "Content-Type:image/png" -h "Cache-Control:no-store" cp -r img gs://${GCP_BUCKET}
